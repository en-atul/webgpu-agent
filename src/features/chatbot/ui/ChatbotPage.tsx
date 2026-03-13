import { type SyntheticEvent, useEffect, useRef, useState } from "react";
import { runAgentStream } from "../../../agent";
import { useModelStore } from "../../../shared/model/store";
import { MarkdownRenderer } from "../../../shared/ui/MarkdownRenderer";
import { Input } from "../../../shared/ui/Input";
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollContainerRef.current?.scrollTo({
      top: scrollContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || !ready) return;
    const userMessage = { role: "user" as const, content: text };
    setMessages((prev) => [...prev, userMessage, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);
    try {
      const historyForContext = [...messages, userMessage];
      await runAgentStream({
        messages: historyForContext,
        systemPrompt:
          "You are a helpful conversational assistant. Format replies with markdown: use **bold** for key terms and \"- \" for bullet lists (e.g. after \"Tasks:\" put each item on its own line starting with \"- \"). Use short paragraphs and line breaks between sections.",
        onDelta: (delta) => {
          setMessages((prev) => {
            if (!prev.length) return prev;
            const next = [...prev];
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
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-white/5 px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-medium text-white">
          <span className="rounded-full bg-white/10 px-3 py-1.5">
            {displayModelName}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            disabled
          >
            <FiSettings className="h-3.5 w-3.5" />
            Configuration
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            disabled
          >
            <FiUpload className="h-3.5 w-3.5" />
            Export
          </button>
        </div>
      </header>

      <div
        className={`relative flex-1 min-h-0 flex flex-col overflow-hidden ${messages.length === 0 ? "py-6 items-center justify-center px-4" : "py-2 pl-4 pr-0"}`}
      >
        {messages.length === 0 ? (
          <>
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
                    disabled={label === "Create Image"}
                    onClick={() => onSuggestion(prompt)}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-gray-200 transition hover:border-violet-500/40 hover:bg-violet-500/15 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white/5 disabled:hover:border-white/10"
                  >
                    <Icon className="h-4 w-4 text-violet-400/90" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div
            ref={scrollContainerRef}
            className="flex-1 min-h-0 overflow-y-auto overscroll-contain pr-4"
          >
            <div className="max-w-3xl mx-auto space-y-4 py-2">
              {messages.map((m, i) =>
                m.role === "user" ? (
                  <div key={i} className="flex justify-end">
                    <div className="rounded-2xl bg-violet-500/15 border border-violet-500/25 px-4 py-2.5 text-sm text-white max-w-[85%]">
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
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-white/5 p-4">
        {!ready && (
          <p className="mb-2 text-xs text-amber-400">
            Load the model from the sidebar to start chatting.
          </p>
        )}
        <form onSubmit={onSubmit} className="space-y-2">
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 focus-within:border-violet-500/40 focus-within:bg-white/10 transition">
            <span className="text-violet-400/90 text-lg">✨</span>
            <Input
              unwrapped
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Anything..."
              disabled={!ready || loading}
            />
            <button
              type="button"
              className="rounded-full p-2 text-gray-400 hover:bg-white/10 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled
              title="Voice input"
            >
              <FiMic className="h-4 w-4" />
            </button>
            <button
              type="submit"
              disabled={!ready || loading}
              className="rounded-full bg-violet-600/90 p-2 text-white shadow-lg shadow-violet-600/25 transition hover:bg-violet-500/90 disabled:opacity-50 disabled:shadow-none"
              title="Send"
            >
              <FiSend className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-4 text-gray-500">
              <button
                type="button"
                className="flex items-center gap-1.5 transition hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled
              >
                <FiPaperclip className="h-3.5 w-3.5" />
                Attach
              </button>
              <button
                type="button"
                className="flex items-center gap-1.5 transition hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled
              >
                <FiSettings className="h-3.5 w-3.5" />
                Settings
              </button>
              <button
                type="button"
                className="flex items-center gap-1.5 transition hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled
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
