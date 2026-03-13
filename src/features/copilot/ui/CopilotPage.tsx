import { type FormEventHandler, useState } from "react";
import { runAgent } from "../../../agent";
import { useModelStore } from "../../../shared/model/store";
import { MarkdownRenderer } from "../../../shared/ui/MarkdownRenderer";

export function CopilotPage() {
  const { ready } = useModelStore();
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || !ready) return;
    setLoading(true);
    try {
      const result = await runAgent(
        `You are a coding copilot. Provide concise code suggestions, with TypeScript/JavaScript examples where relevant.\n\nRequest: ${prompt}`,
      );
      setResponse(result);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Coding Copilot</h2>
      {!ready && (
        <p className="text-sm text-amber-300">
          Load the model from the sidebar to get code suggestions.
        </p>
      )}
      <form onSubmit={onSubmit} className="space-y-2">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full min-h-24 rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
          placeholder="Describe what you want to build or refactor…"
          disabled={!ready || loading}
        />
        <button
          type="submit"
          disabled={!ready || loading}
          className="rounded bg-sky-600 hover:bg-sky-500 disabled:opacity-50 px-3 py-2 text-sm font-medium"
        >
          Generate
        </button>
      </form>
      {response && <MarkdownRenderer content={response} />}
    </div>
  );
}

