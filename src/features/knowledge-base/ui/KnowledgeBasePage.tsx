import { type FormEventHandler, useState } from "react";
import { useKnowledgeBaseStore } from "../model/store";
import { runAgent } from "../../../agent";
import { useModelStore } from "../../../shared/model/store";
import { MarkdownRenderer } from "../../../shared/ui/MarkdownRenderer";

export function KnowledgeBasePage() {
  const { notes, addNote } = useKnowledgeBaseStore();
  const { ready } = useModelStore();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const onAddNote: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    addNote(title, content);
    setTitle("");
    setContent("");
  };

  const onAsk: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!query.trim() || !ready || !notes.length) return;
    setLoading(true);
    try {
      const kbText = notes
        .map((n) => `Title: ${n.title}\nContent: ${n.content}`)
        .join("\n\n---\n\n");
      const result = await runAgent(
        `You are an offline knowledge base assistant. Answer questions using ONLY the provided notes. If the answer is not present, say you don't know.\n\nNotes:\n${kbText}\n\nQuestion: ${query}`,
      );
      setAnswer(result);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Offline Knowledge Base</h2>
        <form onSubmit={onAddNote} className="space-y-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
            placeholder="Note title"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-32 rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
            placeholder="Note content…"
          />
          <button
            type="submit"
            className="rounded bg-sky-600 hover:bg-sky-500 px-3 py-2 text-sm font-medium"
          >
            Add Note
          </button>
        </form>
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-slate-200">Notes</h3>
          {!notes.length && (
            <p className="text-xs text-slate-400">
              Add some notes to build your offline knowledge base.
            </p>
          )}
          <ul className="space-y-2 text-sm">
            {notes.map((n) => (
              <li
                key={n.id}
                className="border border-slate-800 rounded p-2 bg-slate-900/60"
              >
                <div className="font-medium">{n.title}</div>
                <p className="text-xs text-slate-300 whitespace-pre-wrap">
                  {n.content}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-slate-200">
          Ask the knowledge base
        </h3>
        {!ready && (
          <p className="text-xs text-amber-300">
            Load the model from the sidebar to enable Q&amp;A.
          </p>
        )}
        <form onSubmit={onAsk} className="space-y-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
            placeholder="Ask a question about your notes…"
            disabled={!ready || loading || !notes.length}
          />
          <button
            type="submit"
            disabled={!ready || loading || !notes.length}
            className="rounded bg-sky-600 hover:bg-sky-500 disabled:opacity-50 px-3 py-2 text-sm font-medium"
          >
            Ask
          </button>
        </form>
        {answer && <MarkdownRenderer content={answer} />}
      </div>
    </div>
  );
}

