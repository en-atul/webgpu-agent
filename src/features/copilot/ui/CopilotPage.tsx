import { type FormEventHandler, useState } from "react";
import { runAgent } from "../../../agent";
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
          className="rounded-xl bg-violet-600/90 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-600/25 transition hover:bg-violet-500/90 disabled:opacity-50 disabled:shadow-none"
        >
          Generate
        </button>
      </form>
      {response && <MarkdownRenderer content={response} />}
    </div>
  );
}

