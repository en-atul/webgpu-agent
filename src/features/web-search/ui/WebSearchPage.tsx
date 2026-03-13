import { type SubmitEventHandler, useState } from "react";
import { runAgent } from "../../../agent";
import { useModelStore } from "../../../shared/model/store";
import { MarkdownRenderer } from "../../../shared/ui/MarkdownRenderer";
import { Input } from "../../../shared/ui/Input";

type DuckDuckGoTopic = {
  Text?: string;
  FirstURL?: string;
  Topics?: DuckDuckGoTopic[];
};

type DuckDuckGoResult = {
  Text?: string;
  FirstURL?: string;
};

type DuckDuckGoResponse = {
  AbstractText?: string;
  AbstractURL?: string;
  RelatedTopics?: DuckDuckGoTopic[];
  Results?: DuckDuckGoResult[];
};

type SearchResult = {
  title: string;
  url: string;
  snippet: string;
};

export function WebSearchPage() {
  const { ready } = useModelStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [analysis, setAnalysis] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!query.trim() || !ready) return;
    setLoading(true);
    setError(null);
    setResults([]);
    setAnalysis("");

    try {
      const url = `/ddg/?q=${encodeURIComponent(
        query,
      )}&format=json&no_html=1&skip_disambig=1`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Search request failed with ${res.status}`);
      }
      const data = (await res.json()) as DuckDuckGoResponse;

      const resultsFromResults: SearchResult[] = (data.Results ?? [])
        .filter((r) => r.Text && r.FirstURL)
        .map((r) => {
          const text = r.Text ?? "";
          const [title, ...rest] = text.split(" - ");
          return {
            title: title || r.FirstURL || "Result",
            url: r.FirstURL ?? "",
            snippet: rest.join(" - ") || text,
          };
        });

      const flattenedTopics: DuckDuckGoTopic[] = [];

      (data.RelatedTopics ?? []).forEach((t) => {
        if (t.Topics && t.Topics.length) {
          flattenedTopics.push(...t.Topics);
        } else {
          flattenedTopics.push(t);
        }
      });

      const resultsFromTopics: SearchResult[] = flattenedTopics
        .filter((t) => t.Text && t.FirstURL)
        .map((t) => {
          const text = t.Text ?? "";
          const [title, ...rest] = text.split(" - ");
          return {
            title: title || t.FirstURL || "Result",
            url: t.FirstURL ?? "",
            snippet: rest.join(" - ") || text,
          };
        });

      const mapped: SearchResult[] = [...resultsFromResults, ...resultsFromTopics].slice(
        0,
        5,
      );

      setResults(mapped);

      if (mapped.length) {
        const summaryPrompt = `You are an AI assistant helping a user interpret real web search results.\n\nUser query: ${query}\n\nHere are some results (title, url, snippet):\n${mapped
          .map(
            (r, i) =>
              `${i + 1}. ${r.title}\nURL: ${r.url}\nSnippet: ${r.snippet}`,
          )
          .join("\n\n")}\n\nProvide a concise answer to the user's query based on these results. Use bullet points for key findings and include the most relevant URLs in your answer.`;

        const aiSummary = await runAgent(summaryPrompt);
        setAnalysis(aiSummary);
      } else {
        setAnalysis(
          "No useful results were returned by the search API for this query.",
        );
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unexpected error during search.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <h2 className="text-xl font-semibold text-white">Web Search Tool</h2>
      <p className="text-sm text-gray-400 max-w-xl">
        This tool runs a real web search (DuckDuckGo Instant Answer API) and
        then lets the local WebGPU model summarize and interpret the results.
      </p>
      <p className="text-xs text-gray-500 max-w-xl italic">
        For better results, use Google Search API (requires API key).
      </p>
      {!ready && (
        <p className="text-sm text-amber-300">
          Load the model from the sidebar to get guidance.
        </p>
      )}
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What do you want to research on the web? (e.g. vite 8 release notes)"
          disabled={!ready || loading}
        />
        <button
          type="submit"
          disabled={!ready || loading}
          className="rounded-xl bg-violet-600/90 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-600/25 transition hover:bg-violet-500/90 disabled:opacity-50 disabled:shadow-none"
        >
          {loading ? "Searching…" : "Run web search"}
        </button>
      </form>

      {error && (
        <p className="text-sm text-red-400">
          Search error: {error}. Try again in a moment.
        </p>
      )}

      {results.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-200">
            Top results
          </h3>
          <ul className="space-y-2 text-sm">
            {results.map((r) => (
              <li
                key={r.url}
                className="rounded-xl border border-white/10 bg-white/5 p-3"
              >
                <a
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-violet-300 hover:text-violet-200 hover:underline font-medium"
                >
                  {r.title}
                </a>
                <p className="text-xs text-gray-500 break-all mt-0.5">{r.url}</p>
                <p className="mt-1 text-xs text-gray-300">{r.snippet}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {analysis && (
        <div className="pt-4 border-t border-white/10">
          <h3 className="text-sm font-semibold text-gray-200 mb-2">
            AI interpretation
          </h3>
          <MarkdownRenderer content={analysis} />
        </div>
      )}
    </div>
  );
}


