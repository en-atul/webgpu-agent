# WebGPU Agent

**WebGPU Agent** is a dashboard of AI tools that run entirely in your browser. One language model (e.g. Llama 3.2) is loaded via WebGPU and powers chat, summarization, a multi-agent coder, knowledge base, and web search—no API keys, no server, and your data stays on your device.

## Screenshots

| Feature | Screenshot |
|---------|------------|
| AI Chatbot | ![AI Chatbot](ai-chatbot.avif) |
| Knowledge Base | ![Knowledge Base](knowledge-base.avif) |
| Web Search | ![Web Search](web-search.avif) |

## Features

| Tool | Description |
|------|-------------|
| **Overview** | Home page with links to each tool. |
| **AI Chatbot** | Free-form chat with conversation context. Replies stream token-by-token with markdown and syntax-highlighted code blocks. |
| **Coding Copilot** | Paste or type a request; get code suggestions and examples in TypeScript/JavaScript. |
| **Coder Agent** | Multi-agent pipeline: **Planner** → **Coder** → **Reviewer**. Describe a coding task and watch the agents collaborate. Runs in a Web Worker for responsive UI. |
| **Document Summarizer** | Paste text or upload PDF, DOCX, or TXT files. Get bullet points and a short summary from the local model. |
| **Knowledge Base** | Add notes (title + content), then ask questions. The model answers only from your notes—useful for personal docs and reference material. |
| **Web Search** | Enter a query; the app fetches results from DuckDuckGo and the model summarizes or synthesizes them. For better results, use Google Search API (requires API key). |

Everything uses the **same in-browser model**. Load it once from the sidebar; when ready, every tool can use it. Inference runs in a **Web Worker** so the UI stays responsive during long generations.

## Requirements

- **WebGPU** support (Chrome 113+, Edge 113+, Safari 18+)
- Sufficient disk space for the model (~600MB+ for Llama 3.2 1B)

## Quick Start

```bash
bun install
bun run dev
```

Open the app, choose a model in the sidebar, and click **Download / Load Model**. When the progress bar reaches 100%, the model is ready.

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start dev server |
| `bun run build` | Production build |
| `bun run preview` | Preview production build |
| `bun run lint` | Run ESLint |

## Tech Stack

- **Runtime**: Bun
- **UI**: React 19, TypeScript, Vite, Tailwind CSS
- **LLM**: [MLC WebLLM](https://github.com/mlc-ai/web-llm) (WebGPU) with Web Worker for inference
- **State**: Zustand
- **Routing**: React Router (`/`, `/chatbot`, `/copilot`, `/coder-agent`, `/summarizer`, `/knowledge-base`, `/web-search`)
- **Markdown**: react-markdown, remark-gfm, react-syntax-highlighter
- **Documents**: pdfjs-dist (PDF), mammoth (DOCX)

## Architecture

- **`src/agent.ts`** — Initializes the MLC engine in a Web Worker, exposes `runAgent(prompt)` and `runAgentStream({ messages, systemPrompt, onDelta })`.
- **`src/worker.ts`** — Web Worker that runs model loading and inference off the main thread.
- Each feature builds its own prompt and calls the same agent. The Coder Agent uses a multi-step pipeline (Planner → Coder → Reviewer) with dedicated system prompts per role.

## License

Unlicensed.
