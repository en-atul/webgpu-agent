# WebGPU Agent

**WebGPU Agent** is a dashboard of AI tools that run entirely in your browser. One language model (e.g. Llama 3.2) is loaded via WebGPU and then used for chat, summarization, a personal knowledge base, and web search—no API keys, no server, and your data stays on your device.

## Screenshots

| AI Chatbot | Knowledge Base | Web Search |
|------------|----------------|------------|
| ![AI Chatbot](ai-chatbot.avif) | ![Knowledge Base](knowledge-base.avif) | ![Web Search](web-search.avif) |

## What’s in the app

- **Overview** — Home page with links to each tool.
- **AI Chatbot** — Free-form chat with the loaded model. Replies stream token-by-token, support markdown and code blocks (with syntax highlighting), and the message list has its own scroll so the page doesn’t stretch. You can switch the active model from the header.
- **Coding Copilot** — Paste or type code and ask the model to improve, explain, or refactor it. Good for quick edits and learning.
- **Document Summarizer** — Paste long text and get a short summary from the same local model.
- **Offline Knowledge Base** — Add notes (title + content). Then ask questions in natural language; the app sends your question plus all notes to the model and asks it to answer only from that context. Useful for personal docs, meeting notes, or reference material without sending data elsewhere.
- **Web Search** — Enter a query; the app fetches results from DuckDuckGo (via a dev proxy to avoid CORS) and shows snippets. You can then ask the local model to summarize or synthesize those results.

Everything uses the **same in-browser model**. Load it once from the sidebar (progress bar shows download/init); when it’s ready, every tool can use it. Model choice is stored so you can switch between available WebLLM models from the header.

## How to run it

You need a browser with **WebGPU** (Chrome 113+, Edge 113+, or Safari 18+) and enough disk space for the model (e.g. ~600MB+ for Llama 3.2 1B).

```bash
bun install
bun run dev
```

Open the app, choose a model in the sidebar, and click **Download / Load Model**. When the bar hits 100%, the model is ready for all tools.


## How it’s built

- **Bun** for install and run; **React 19** + **TypeScript** + **Vite** for the UI and build.
- **MLC WebLLM** (WebGPU) to load and run the model in the browser; **Zustand** holds model state (progress, ready, selected model).
- **React Router** for the shell and routes (`/`, `/chatbot`, `/copilot`, `/summarizer`, `/knowledge-base`, `/web-search`).
- **react-markdown** + **remark-gfm** + **react-syntax-highlighter** for rendering assistant messages (lists, bold, code blocks).
- **Tailwind CSS** for layout and styling.

The core logic lives in `src/agent.ts`: it initializes the MLC engine, exposes `runAgent(prompt)` for one-shot answers and `runAgentStream({ prompt, onDelta })` for streaming. Each feature builds its own prompt (e.g. “answer from these notes”, “summarize this”, “summarize these search results”) and calls the same agent.

## License

Unlicensed.
