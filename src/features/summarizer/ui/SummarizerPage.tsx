import { type FormEventHandler, useState } from "react";
import { runAgentStream } from "../../../agent";
import { useModelStore } from "../../../shared/model/store";
import { MarkdownRenderer } from "../../../shared/ui/MarkdownRenderer";
import { Textarea } from "../../../shared/ui/Textarea";

export function SummarizerPage() {
  const { ready } = useModelStore();
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!text.trim() || !ready) return;
    setLoading(true);
    setSummary("");
    try {
      await runAgentStream({
        prompt: `You are a document summarizer. Summarize the following text in a few bullet points and one short paragraph.\n\nDocument:\n${text}`,
        onDelta: (delta) => setSummary((prev) => prev + delta),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
        <div className="space-y-4 p-4 md:p-6">
          <h2 className="text-xl font-semibold">Document Summarizer</h2>
          {!ready && (
            <p className="text-sm text-amber-300">
              Load the model from the sidebar to summarize documents.
            </p>
          )}
          <form onSubmit={onSubmit} className="space-y-4">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or type your document here…"
              disabled={!ready || loading}
              rows={10}
              className="min-h-48"
            />
            <button
              type="submit"
              disabled={!ready || loading}
              className="rounded-xl bg-violet-600/90 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-600/25 transition hover:bg-violet-500/90 disabled:opacity-50 disabled:shadow-none flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Summarizing…
                </>
              ) : (
                "Summarize"
              )}
            </button>
          </form>
          {summary && <MarkdownRenderer content={summary} />}
        </div>
      </div>
    </div>
  );
}

