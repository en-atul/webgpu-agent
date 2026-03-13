import { NavLink, Outlet } from "react-router-dom";
import { useModelStore } from "../../shared/model/store";
import { formatModelId, ModelSelector } from "../../shared/ui/ModelSelector";
import { Tooltip } from "../../shared/ui/Tooltip";
import {
  FiGrid,
  FiInfo,
  FiMessageCircle,
  FiCode,
  FiFileText,
  FiBook,
  FiSearch,
} from "react-icons/fi";

export function RootLayout() {
  const {
    ready,
    progress,
    status,
    loadModel,
    modelId,
    loading,
  } = useModelStore();

  return (
    <div className="h-screen bg-[#050505] text-gray-200 flex overflow-hidden">
      <aside className="w-64 border-r border-white/5 px-5 py-6 flex flex-col gap-6 bg-black/70 backdrop-blur">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-white">
            WebGPU Agent
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Local LLM tools dashboard
          </p>
        </div>

        <nav className="flex flex-col gap-1 text-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-lg px-3 py-2 transition ${
                isActive
                  ? "bg-violet-500/15 text-violet-300 border border-violet-500/40"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              }`
            }
          >
            <FiGrid className="h-4 w-4 shrink-0 text-gray-400" />
            <span>Overview</span>
          </NavLink>
          <NavLink
            to="/chatbot"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-lg px-3 py-2 transition ${
                isActive
                  ? "bg-violet-500/15 text-violet-300 border border-violet-500/40"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              }`
            }
          >
            <FiMessageCircle className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>AI Chatbot</span>
          </NavLink>
          <NavLink
            to="/copilot"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-lg px-3 py-2 transition ${
                isActive
                  ? "bg-violet-500/15 text-violet-300 border border-violet-500/40"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              }`
            }
          >
            <FiCode className="h-4 w-4 shrink-0 text-purple-400" />
            <span>Coding Copilot</span>
          </NavLink>
          <NavLink
            to="/summarizer"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-lg px-3 py-2 transition ${
                isActive
                  ? "bg-violet-500/15 text-violet-300 border border-violet-500/40"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              }`
            }
          >
            <FiFileText className="h-4 w-4 shrink-0 text-amber-400" />
            <span>Summarizer</span>
          </NavLink>
          <NavLink
            to="/knowledge-base"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-lg px-3 py-2 transition ${
                isActive
                  ? "bg-violet-500/15 text-violet-300 border border-violet-500/40"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              }`
            }
          >
            <FiBook className="h-4 w-4 shrink-0 text-cyan-400" />
            <span>Knowledge Base</span>
          </NavLink>
          <NavLink
            to="/web-search"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-lg px-3 py-2 transition ${
                isActive
                  ? "bg-violet-500/15 text-violet-300 border border-violet-500/40"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              }`
            }
          >
            <FiSearch className="h-4 w-4 shrink-0 text-pink-400" />
            <span>Web Search</span>
          </NavLink>
        </nav>

        <div className="mt-auto space-y-2 text-xs text-gray-400">
          {!ready && (
            <>
              <div className="flex items-center gap-1.5">
                <span className="text-gray-300">Model:</span>
                <span className="font-medium text-white truncate">{formatModelId(modelId)}</span>
                <Tooltip content="To change model, click the model selector in the top right.">
                <span className="text-gray-500 hover:text-gray-300 cursor-help shrink-0 inline-flex">
                  <FiInfo className="h-3.5 w-3.5" />
                </span>
              </Tooltip>
              </div>
              <div className="relative w-full rounded-full p-[3px] overflow-hidden">
                <div
                  className="absolute left-1/2 top-1/2 w-[150%] h-[150%] -translate-x-1/2 -translate-y-1/2 rounded-full animate-gradient-spin"
                  style={{
                    background:
                      "conic-gradient(from 0deg at 50% 50%, #8b5cf6, #a78bfa, #c084fc, #7c3aed, #6d28d9, #8b5cf6)",
                  }}
                />
                <button
                  onClick={loadModel}
                  className="relative w-full rounded-full bg-black hover:bg-neutral-900 border border-violet-500/50 px-3 py-2 text-xs font-medium text-white shadow-lg transition-colors z-10"
                >
                  Download / Load Model
                </button>
              </div>
              {loading && (
                <>
                  <p>{status}</p>
                  <div className="w-full h-1.5 rounded-full bg-neutral-900 overflow-hidden">
                    <div
                      className="h-full bg-violet-500/80 transition-[width] duration-500 ease-out"
                      style={{ width: `${Math.round(progress * 100)}%` }}
                    />
                  </div>
                  <p>{Math.round(progress * 100)}%</p>
                </>
              )}
            </>
          )}
          {ready && (
            <p className="text-emerald-400 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Model ready
            </p>
          )}
        </div>
      </aside>

      <main className="flex-1 min-h-0 flex flex-col px-8 py-6">
        <header className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Workspace</h2>
            <p className="text-xs text-gray-500">
              Switch between tools powered by the same in-browser model.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ModelSelector />
          </div>
        </header>

        <section className="mt-2 flex-1 min-h-0">
          <div className="h-full rounded-2xl border border-white/5 bg-gradient-to-br from-neutral-950/80 via-neutral-950/60 to-black/80 shadow-[0_0_40px_rgba(0,0,0,0.6)] overflow-hidden">
            <Outlet />
          </div>
        </section>
      </main>
    </div>
  );
}

