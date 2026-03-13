export function HomePage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Welcome</h2>
      <p className="text-slate-300 max-w-xl">
        This app runs an in-browser WebGPU model and exposes multiple tools
        built on top of the same local LLM.
      </p>
      <ul className="list-disc list-inside text-slate-200 space-y-1">
        <li>AI Chatbot</li>
        <li>Coding Copilot</li>
        <li>Document Summarizer</li>
        <li>Offline Knowledge Base</li>
        <li>Web Search Tool (model-assisted)</li>
      </ul>
    </div>
  );
}

