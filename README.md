# Flow Reel Studio

A single HTML file that turns one idea into a complete reel package for **Google Flow (Veo)** in one click:

- Story with a hook, conflict, twist and payoff, split into 8-second clips
- A fixed character "lock" and location "lock". These descriptions are copied word for word into every scene prompt, so faces, outfits and places stay the same in every clip
- Reference image prompts for each character and location, to use as *Ingredients* in Flow
- One prompt per scene, ready to paste, as structured text or JSON. Each covers style, characters, location, shot, camera, action, dialogue or voice-over, audio, how the scene starts and ends, and things to avoid
- Caption, hashtags, thumbnail prompt and music prompt
- Copy all, download as .txt, .json or .md, history of your last 20 reels, and JSON import

## Run it

Double-click `index.html`. It has no install and no server, and everything stays in your browser.

| Provider | What you need |
|---|---|
| **Gemini** | A free API key from https://aistudio.google.com/apikey. The default model is `gemini-2.5-flash`, and you can type any model id. |
| **Claude** | An API key from https://console.anthropic.com. The default model is `claude-opus-5-5`. It is called directly from your browser. |
| **Ollama** (fully local, free) | Install https://ollama.com, run `ollama pull llama3.1`, then start it so the page is allowed to call it:<br>macOS/Linux: `OLLAMA_ORIGINS="*" ollama serve`<br>Windows (PowerShell): `$env:OLLAMA_ORIGINS="*"; ollama serve` |
| **Offline** | Nothing. It builds a template you fill in yourself. |

If you tick "Remember key", the key is saved only in this browser's localStorage.

## Workflow in Flow

1. Generate the reel here (press the button or Ctrl+Enter).
2. In the **Characters & places** tab, generate each reference image and keep the best one.
3. In Flow, use **Ingredients to Video**. For each scene, add its reference images and paste the scene prompt.
4. Make 2–4 takes per scene, keep the most consistent one, put them in order in Scenebuilder, and export.
