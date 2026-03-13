import { type FormEventHandler, useState } from "react";
import { runAgentStream } from "../../../agent";
import { useModelStore } from "../../../shared/model/store";
import { MarkdownRenderer } from "../../../shared/ui/MarkdownRenderer";
import { Textarea } from "../../../shared/ui/Textarea";

export function CopilotPage() {
  const { ready } = useModelStore();
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || !ready) return;
    setLoading(true);
    setResponse("");
    try {
      await runAgentStream({
        prompt: `You are a coding copilot. Provide concise code suggestions, with TypeScript/JavaScript examples where relevant.\n\nRequest: ${prompt}`,
        onDelta: (delta) => setResponse((prev) => prev + delta),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
        <div className="space-y-4 p-4 md:p-6">
          <h2 className="text-xl font-semibold">Coding Copilot</h2>
          {!ready && (
            <p className="text-sm text-amber-300">
              Load the model from the sidebar to get code suggestions.
            </p>
          )}
          <form onSubmit={onSubmit} className="space-y-4">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to build or refactor…"
              disabled={!ready || loading}
              rows={5}
              className="min-h-28"
            />
            <button
              type="submit"
              disabled={!ready || loading}
              className="rounded-xl bg-violet-600/90 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-600/25 transition hover:bg-violet-500/90 disabled:opacity-50 disabled:shadow-none flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Generating…
                </>
              ) : (
                "Generate"
              )}
            </button>
          </form>
          {response && <MarkdownRenderer content={response} />}
        </div>
      </div>
    </div>
  );
}

