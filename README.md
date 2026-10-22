# Flow Reel Studio

Type a **keyword** and click once to get **one complete prompt** you can paste straight into **Google Flow (Veo)**. The prompt contains:

- the story (hook, conflict, twist, payoff)
- characters with locked looks, so the same face, hair and outfit appear in every shot
- locations, a timed shot list, dialogue or narration, sound and music
- a list of things to avoid

## Built-in cast: Fluffy Buddies

Every story stars your own characters, **Kiki, Mochi, Pomu, Pinki and Lulu**. Tap their cards to choose who appears. Their exact look, voice and personality are built into the app, and the same description is pasted into every shot, so they always look the same. They live in one fixed world (*Sunny Clover Meadow*) and one fixed style (3D plush with golden-hour light).

The reference sheets are in [`cast/`](cast/) (`kiki-sheet.jpg` …). Upload them in Flow as **Ingredients** for the best consistency. To add or edit a character, change the `BUDDIES` list in `index.html` and add the matching `cast/<id>.jpg` and `cast/<id>-sheet.jpg` images. Switch *Characters* to "AI creates new characters" to get a fresh cast instead.

Everything is on **Auto**: the AI picks the genre, style, length, language and audio. If a keyword is unclear (for example a brand or person name), it asks you up to 3 quick questions first. You can also skip them.

Extras: per-scene prompts for longer reels, character and location reference image prompts, caption, hashtags, thumbnail and music prompts, history, and download as .txt, .json or .md. If you want control, open **Customize**.

## Run it: Claude Code CLI (recommended, local, no API key)

Requires [Node.js 18+](https://nodejs.org) and [Claude Code](https://claude.com/claude-code), installed and logged in. Check that `claude` works in a terminal first.

```bash
cd flow-reel-studio
node server.mjs
```

The browser opens at **http://localhost:4747**. Type a keyword and press **Create my Flow prompt**.

The server runs only on your computer (127.0.0.1). For each request it runs `claude -p` with all tools turned off, so Claude only writes text and never touches your files. It uses your normal Claude Code login. The *Model* field is optional: leave it empty for your default model, or type `opus` or `sonnet`.

## Other engines

Choose these under **AI engine**.

| Provider | What you need |
|---|---|
| **Gemini** | A free API key from https://aistudio.google.com/apikey |
| **Claude API** | An API key from https://console.anthropic.com |
| **Ollama** (fully offline) | `ollama pull llama3.1`, then `OLLAMA_ORIGINS="*" ollama serve` |
| **Offline** | Nothing; builds a template you fill in yourself |

The API-key and offline options also work by just double-clicking `index.html` without the server. API keys are saved only in your browser.

## Using it in Flow

1. Copy the **Flow prompt** and paste it into Flow (Text to Video, Veo with audio).
2. Veo renders about 8 seconds per generation. For a longer reel, paste the **Per-scene prompts** one by one and join the clips in Scenebuilder.
3. For the most consistent faces, generate the character images first and add them as **Ingredients**.
