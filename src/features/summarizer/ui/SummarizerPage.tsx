import { type SubmitEventHandler, useRef, useState } from "react";
import { FiUpload } from "react-icons/fi";
import { runAgentStream } from "../../../agent";
import { useModelStore } from "../../../shared/model/store";
import { MarkdownRenderer } from "../../../shared/ui/MarkdownRenderer";
import { Textarea } from "../../../shared/ui/Textarea";
import { extractTextFromFile, isSupported } from "../lib/extractText";

const ACCEPT = ".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain";

export function SummarizerPage() {
  const { ready } = useModelStore();
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [extractError, setExtractError] = useState("");
  const [extracting, setExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    setExtractError("");
    setExtracting(true);
    try {
      if (!isSupported(file)) {
        setExtractError("Unsupported format. Use PDF, DOCX, or TXT.");
        return;
      }
      const extracted = await extractTextFromFile(file);
      setText(extracted);
    } catch (err) {
      setExtractError(err instanceof Error ? err.message : "Failed to read file.");
    } finally {
      setExtracting(false);
    }
  };

  const onSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
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
            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPT}
                onChange={onFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={!ready || loading || extracting}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-gray-200 transition hover:bg-white/10 hover:border-violet-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiUpload className="h-4 w-4" />
                {extracting ? "Reading…" : "Upload PDF, DOCX, or TXT"}
              </button>
              <span className="text-xs text-gray-500">
                Or paste text below
              </span>
            </div>
            {extractError && (
              <p className="text-sm text-amber-400">{extractError}</p>
            )}
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
              disabled={!ready || loading || !text.trim()}
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

