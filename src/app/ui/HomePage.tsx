import { Link } from "react-router-dom";
import {
  FiMessageCircle,
  FiCode,
  FiFileText,
  FiBook,
  FiSearch,
  FiArrowRight,
} from "react-icons/fi";

const FEATURES = [
  {
    title: "AI Chatbot",
    description: "Streaming chat with the local model. Ask questions, brainstorm, or get help in real time.",
    path: "/chatbot",
    icon: FiMessageCircle,
    accent: "emerald",
  },
  {
    title: "Coding Copilot",
    description: "Get code suggestions, refactors, and examples in TypeScript/JavaScript.",
    path: "/copilot",
    icon: FiCode,
    accent: "purple",
  },
  {
    title: "Document Summarizer",
    description: "Paste long text and get bullet points and a short summary.",
    path: "/summarizer",
    icon: FiFileText,
    accent: "amber",
  },
  {
    title: "Offline Knowledge Base",
    description: "Add notes and query them with the model—all without leaving the browser.",
    path: "/knowledge-base",
    icon: FiBook,
    accent: "cyan",
  },
  {
    title: "Web Search Tool",
    description: "Run real web search (DuckDuckGo) and let the model interpret results.",
    path: "/web-search",
    icon: FiSearch,
    accent: "pink",
  },
] as const;

const accentClasses: Record<string, string> = {
  emerald:
    "text-emerald-400 border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20",
  purple:
    "text-purple-400 border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20",
  amber:
    "text-amber-400 border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20",
  cyan: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20",
  pink: "text-pink-400 border-pink-500/30 bg-pink-500/10 hover:bg-pink-500/20",
};

export function HomePage() {
  return (
    <div className="flex flex-col gap-8 p-4 md:p-6">
      <section>
        <h1 className="text-2xl font-semibold text-white tracking-tight">
          Welcome
        </h1>
        <p className="mt-2 max-w-xl text-sm text-gray-400">
          This app runs an in-browser WebGPU model and exposes multiple tools
          built on top of the same local LLM.
        </p>
      </section>

      <section>
        <h2 className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-4">
          Features
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ title, description, path, icon: Icon, accent }) => (
            <Link
              key={path}
              to={path}
              className="group flex flex-col rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-violet-500/30 hover:bg-white/10"
            >
              <div
                className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${accentClasses[accent]}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-base font-medium text-white">
                {title}
              </h3>
              <p className="mt-1.5 text-sm text-gray-400 line-clamp-2">
                {description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-violet-400 group-hover:text-violet-300">
                Open
                <FiArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
