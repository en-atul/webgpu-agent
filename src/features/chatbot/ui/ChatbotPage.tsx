import { type SyntheticEvent, useState } from "react";
import { runAgentStream } from "../../../agent";
import { useModelStore } from "../../../shared/model/store";
import { MarkdownRenderer } from "../../../shared/ui/MarkdownRenderer";
import {
  FiSettings,
  FiUpload,
  FiImage,
  FiZap,
  FiFileText,
  FiPaperclip,
  FiMenu,
  FiMic,
  FiSend,
} from "react-icons/fi";

const SUGGESTIONS = [
  { label: "Create Image", icon: FiImage, prompt: "Generate an image description or idea for: " },
  { label: "Brainstorm", icon: FiZap, prompt: "Help me brainstorm ideas about: " },
  { label: "Make a plan", icon: FiFileText, prompt: "Help me make a plan for: " },
] as const;

export function ChatbotPage() {
  const { ready, modelId } = useModelStore();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text: string) => {
    if (!text.trim() || !ready) return;
    const userMessage = { role: "user" as const, content: text };
    setMessages((prev) => [...prev, userMessage, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);
    try {
      await runAgentStream({
        prompt: `You are a helpful conversational assistant.\n\nUser: ${userMessage.content}`,
        onDelta: (delta) => {
          setMessages((prev) => {
            if (!prev.length) return prev;
            const next = [...prev];
            // Update the last assistant message
            for (let i = next.length - 1; i >= 0; i--) {
              if (next[i].role === "assistant") {
                next[i] = { ...next[i], content: next[i].content + delta };
                break;
              }
            }
            return next;
          });
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    await sendMessage(input);
  };

  const onSuggestion = (prompt: string) => {
    setInput(prompt);
  };

  const displayModelName = modelId.replace("-Instruct-q4f32_1-MLC", "");

  return (
    <div className="flex h-full min-h-0 flex-col rounded-2xl bg-gradient-to-b from-violet-950/40 via-neutral-950/60 to-black overflow-hidden">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-white/5 px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-medium text-white">
          <span className="rounded-full bg-white/10 px-3 py-1.5">
            {displayModelName}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-300 transition hover:bg-white/10 hover:text-white"
          >
            <FiSettings className="h-3.5 w-3.5" />
            Configuration
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-300 transition hover:bg-white/10 hover:text-white"
          >
            <FiUpload className="h-3.5 w-3.5" />
            Export
          </button>
        </div>
      </header>

      {/* Center: orb + greeting or messages */}
      <div className="relative flex-1 min-h-0 flex flex-col items-center justify-center px-4 py-6">
        {messages.length === 0 ? (
          <>
            {/* Glowing orb */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] h-48 w-48 rounded-full opacity-60"
              style={{
                background:
                  "radial-gradient(circle, rgba(139,92,246,0.5) 0%, rgba(59,7,100,0.3) 40%, transparent 70%)",
                filter: "blur(40px)",
              }}
            />
            <div className="relative z-10 text-center space-y-6">
              <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
                Ready to Create Something New?
              </h2>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map(({ label, icon: Icon, prompt }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => onSuggestion(prompt)}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-gray-200 transition hover:border-violet-500/40 hover:bg-violet-500/20 hover:text-white"
                  >
                    <Icon className="h-4 w-4 text-violet-300" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="w-full max-w-3xl flex-1 overflow-auto space-y-4 py-4">
            {messages.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="flex justify-end">
                  <div className="rounded-2xl bg-violet-500/20 border border-violet-500/30 px-4 py-2.5 text-sm text-white max-w-[85%]">
                    {m.content}
                  </div>
                </div>
              ) : (
                <div key={i} className="flex justify-start">
                  <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-gray-200 max-w-[85%] [&_.prose]:!max-w-none">
                    <MarkdownRenderer content={m.content} />
                  </div>
                </div>
              ),
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-2 text-sm text-gray-400">
                  Thinking…
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="shrink-0 border-t border-white/5 p-4">
        {!ready && (
          <p className="mb-2 text-xs text-amber-400">
            Load the model from the sidebar to start chatting.
          </p>
        )}
        <form onSubmit={onSubmit} className="space-y-2">
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 focus-within:border-violet-500/40 focus-within:bg-white/10 transition">
            <span className="text-violet-300 text-lg">✨</span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 min-w-0 bg-transparent text-sm text-white placeholder-gray-500 outline-none"
              placeholder="Ask Anything..."
              disabled={!ready || loading}
            />
            <button
              type="button"
              className="rounded-full p-2 text-gray-400 hover:bg-white/10 hover:text-white transition"
              title="Voice input"
            >
              <FiMic className="h-4 w-4" />
            </button>
            <button
              type="submit"
              disabled={!ready || loading}
              className="rounded-full bg-violet-500 p-2 text-white shadow-lg shadow-violet-500/30 transition hover:bg-violet-400 disabled:opacity-50 disabled:shadow-none"
              title="Send"
            >
              <FiSend className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-4 text-gray-500">
              <button
                type="button"
                className="flex items-center gap-1.5 transition hover:text-gray-300"
              >
                <FiPaperclip className="h-3.5 w-3.5" />
                Attach
              </button>
              <button
                type="button"
                className="flex items-center gap-1.5 transition hover:text-gray-300"
              >
                <FiSettings className="h-3.5 w-3.5" />
                Settings
              </button>
              <button
                type="button"
                className="flex items-center gap-1.5 transition hover:text-gray-300"
              >
                <FiMenu className="h-3.5 w-3.5" />
                Options
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
