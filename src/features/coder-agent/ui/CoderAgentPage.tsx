import { type SubmitEventHandler, useState } from "react";
import { useModelStore } from "../../../shared/model/store";
import { MarkdownRenderer } from "../../../shared/ui/MarkdownRenderer";
import { Textarea } from "../../../shared/ui/Textarea";
import {
  runPlannerAgent,
  runCoderAgent,
  runReviewerAgent,
  type AgentRole,
} from "../lib/agents";
import { FiCpu, FiCode, FiCheckCircle } from "react-icons/fi";

type AgentOutput = {
  role: AgentRole;
  label: string;
  icon: typeof FiCpu;
  content: string;
  status: "pending" | "streaming" | "done";
};

const AGENT_CONFIG: Record<AgentRole, { label: string; icon: typeof FiCpu }> = {
  planner: { label: "Planner", icon: FiCpu },
  coder: { label: "Coder", icon: FiCode },
  reviewer: { label: "Reviewer", icon: FiCheckCircle },
};

export function CoderAgentPage() {
  const { ready } = useModelStore();
  const [prompt, setPrompt] = useState("");
  const [outputs, setOutputs] = useState<AgentOutput[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || !ready) return;
    setLoading(true);
    setError(null);
    setOutputs([
      { role: "planner", ...AGENT_CONFIG.planner, content: "", status: "streaming" },
      { role: "coder", ...AGENT_CONFIG.coder, content: "", status: "pending" },
      { role: "reviewer", ...AGENT_CONFIG.reviewer, content: "", status: "pending" },
    ]);

    try {
      let plan = "";
      let code = "";

      plan = await runPlannerAgent(prompt, (delta) => {
        setOutputs((prev) =>
          prev.map((o) =>
            o.role === "planner"
              ? { ...o, content: o.content + delta, status: "streaming" as const }
              : o,
          ),
        );
      });
      setOutputs((prev) =>
        prev.map((o) =>
          o.role === "planner" ? { ...o, status: "done" as const } : o,
        ),
      );

      setOutputs((prev) =>
        prev.map((o) =>
          o.role === "coder" ? { ...o, status: "streaming" as const } : o,
        ),
      );
      code = await runCoderAgent(prompt, plan, (delta) => {
        setOutputs((prev) =>
          prev.map((o) =>
            o.role === "coder"
              ? { ...o, content: o.content + delta, status: "streaming" as const }
              : o,
          ),
        );
      });
      setOutputs((prev) =>
        prev.map((o) =>
          o.role === "coder" ? { ...o, status: "done" as const } : o,
        ),
      );

      setOutputs((prev) =>
        prev.map((o) =>
          o.role === "reviewer" ? { ...o, status: "streaming" as const } : o,
        ),
      );
      await runReviewerAgent(prompt, plan, code, (delta) => {
        setOutputs((prev) =>
          prev.map((o) =>
            o.role === "reviewer"
              ? { ...o, content: o.content + delta, status: "streaming" as const }
              : o,
          ),
        );
      });
      setOutputs((prev) =>
        prev.map((o) =>
          o.role === "reviewer" ? { ...o, status: "done" as const } : o,
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during generation.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
        <div className="space-y-6 p-4 md:p-6">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Coder Agent (Multi-Agent)
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              Planner → Coder → Reviewer. Describe a coding task and watch the
              agents collaborate.
            </p>
          </div>

          {!ready && (
            <p className="text-sm text-amber-300">
              Load the model from the sidebar to use the Coder Agent.
            </p>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Create a React hook that fetches data with loading and error states"
              disabled={!ready || loading}
              rows={4}
              className="min-h-24"
            />
            <button
              type="submit"
              disabled={!ready || loading}
              className="rounded-xl bg-violet-600/90 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-600/25 transition hover:bg-violet-500/90 disabled:opacity-50 disabled:shadow-none flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Running agents…
                </>
              ) : (
                "Run Coder Agent"
              )}
            </button>
          </form>

          {error && (
            <p className="text-sm text-red-400">Error: {error}</p>
          )}

          {outputs.length > 0 && (
            <div className="space-y-6 pt-4 border-t border-white/10">
              {outputs.map((o) => (
                <div
                  key={o.role}
                  className="rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <o.icon className="h-4 w-4 text-violet-400" />
                    <span className="text-sm font-medium text-white">
                      {o.label}
                    </span>
                    {o.status === "streaming" && (
                      <span className="h-2 w-2 rounded-full bg-violet-400 animate-pulse" />
                    )}
                    {o.status === "done" && (
                      <span className="text-xs text-emerald-400">✓</span>
                    )}
                  </div>
                  {o.content ? (
                    <div className="rounded-lg bg-black/30 p-3 text-sm [&_.prose]:!max-w-none">
                      <MarkdownRenderer content={o.content} />
                    </div>
                  ) : o.status === "streaming" ? (
                    <p className="text-sm text-gray-500">Thinking…</p>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
