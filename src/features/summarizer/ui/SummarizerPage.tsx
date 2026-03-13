import { type FormEventHandler, useState } from "react";
import { runAgent } from "../../../agent";
import { useModelStore } from "../../../shared/model/store";
import { MarkdownRenderer } from "../../../shared/ui/MarkdownRenderer";

export function SummarizerPage() {
  const { ready } = useModelStore();
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!text.trim() || !ready) return;
    setLoading(true);
    try {
      const result = await runAgent(
        `You are a document summarizer. Summarize the following text in a few bullet points and one short paragraph.\n\nDocument:\n${text}`,
      );
      setSummary(result);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Document Summarizer</h2>
      {!ready && (
        <p className="text-sm text-amber-300">
          Load the model from the sidebar to summarize documents.
        </p>
      )}
      <form onSubmit={onSubmit} className="space-y-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full min-h-40 rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
          placeholder="Paste or type your document here…"
          disabled={!ready || loading}
        />
        <button
          type="submit"
          disabled={!ready || loading}
          className="rounded bg-sky-600 hover:bg-sky-500 disabled:opacity-50 px-3 py-2 text-sm font-medium"
        >
          Summarize
        </button>
      </form>
      {summary && <MarkdownRenderer content={summary} />}
    </div>
  );
}

