#!/usr/bin/env node
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { readFile, writeFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HOST = "127.0.0.1";
const PORT = Number(process.env.PORT) || 4747;
const ORIGINS = new Set([`http://localhost:${PORT}`, `http://${HOST}:${PORT}`]);
const TIMEOUT_MS = 5 * 60 * 1000;
const MAX_BODY = 200_000;
const ROOT = dirname(fileURLToPath(import.meta.url));
const IS_WIN = process.platform === "win32";

function send(res, status, body, type = "application/json") {
  res.writeHead(status, { "Content-Type": type, "Cache-Control": "no-store" });
  res.end(type === "application/json" ? JSON.stringify(body) : body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (c) => { data += c; if (data.length > MAX_BODY) { reject(new Error("Request too large")); req.destroy(); } });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

function run(cmd, args, input) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { shell: IS_WIN, windowsHide: true, cwd: tmpdir() });
    let out = "", err = "";
    const timer = setTimeout(() => { child.kill(); reject(new Error("Claude CLI timed out")); }, TIMEOUT_MS);
    child.stdout.on("data", (d) => { out += d; });
    child.stderr.on("data", (d) => { err += d; });
    child.on("error", (e) => { clearTimeout(timer); reject(e.code === "ENOENT" ? new Error("`claude` command not found. Install Claude Code: npm install -g @anthropic-ai/claude-code") : e); });
    child.on("close", (code) => { clearTimeout(timer); code === 0 ? resolve(out) : reject(new Error((err || out).trim().slice(0, 500) || `claude exited with code ${code}`)); });
    child.stdin.end(input);
  });
}

async function claudeGenerate({ system, prompt, model }) {
  const dir = await mkdtemp(join(tmpdir(), "flow-reel-"));
  const sysFile = join(dir, "system.txt");
  try {
    await writeFile(sysFile, system, "utf8");
    const q = (s) => (IS_WIN ? `"${s}"` : s);
    const args = ["-p", "--output-format", "json", "--system-prompt-file", q(sysFile), "--tools", IS_WIN ? '""' : "", "--strict-mcp-config", "--no-session-persistence"];
    if (model && /^[\w.:-]+$/.test(model)) args.push("--model", model);
    const raw = await run("claude", args, prompt);
    const data = JSON.parse(raw);
    if (data.is_error) throw new Error(data.result || "Claude CLI returned an error");
    return data.result;
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  try {
    if (req.method === "GET" && (url.pathname === "/" || url.pathname === "/index.html")) {
      return send(res, 200, await readFile(join(ROOT, "index.html")), "text/html; charset=utf-8");
    }
    const asset = url.pathname.match(/^\/cast\/([a-z0-9-]+\.jpg)$/);
    if (req.method === "GET" && asset) return send(res, 200, await readFile(join(ROOT, "cast", asset[1])), "image/jpeg");
    if (req.method === "GET" && url.pathname === "/api/health") return send(res, 200, { ok: true });
    if (req.method === "POST" && url.pathname === "/api/claude") {
      if (!ORIGINS.has(req.headers.origin)) return send(res, 403, { error: "Open the app at http://localhost:" + PORT });
      const { system, prompt, model } = JSON.parse(await readBody(req));
      if (typeof system !== "string" || typeof prompt !== "string") return send(res, 400, { error: "system and prompt are required" });
      return send(res, 200, { text: await claudeGenerate({ system, prompt, model }) });
    }
    send(res, 404, { error: "Not found" });
  } catch (e) {
    send(res, 500, { error: e.message || String(e) });
  }
});

server.listen(PORT, HOST, () => {
  const link = `http://localhost:${PORT}`;
  console.log(`Flow Reel Studio running at ${link}  (Ctrl+C to stop)`);
  const opener = IS_WIN ? ["cmd", ["/c", "start", "", link]] : process.platform === "darwin" ? ["open", [link]] : ["xdg-open", [link]];
  if (!process.env.NO_OPEN) spawn(opener[0], opener[1], { stdio: "ignore", detached: true }).on("error", () => {}).unref();
});
