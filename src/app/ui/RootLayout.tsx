import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useModelStore } from "../../shared/model/store";
import { FiCpu, FiChevronDown } from "react-icons/fi";

export function RootLayout() {
  const [modelMenuOpen, setModelMenuOpen] = useState(false);
  const {
    ready,
    progress,
    status,
    loadModel,
    modelId,
    availableModels,
    setModelId,
    downloadedModels,
  } = useModelStore();

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 flex">
      {/* Sidebar */}
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
                  ? "bg-sky-500/15 text-sky-300 border border-sky-500/40"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              }`
            }
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gray-500" />
            <span>Overview</span>
          </NavLink>
          <NavLink
            to="/chatbot"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-lg px-3 py-2 transition ${
                isActive
                  ? "bg-sky-500/15 text-sky-300 border border-sky-500/40"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              }`
            }
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>AI Chatbot</span>
          </NavLink>
          <NavLink
            to="/copilot"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-lg px-3 py-2 transition ${
                isActive
                  ? "bg-sky-500/15 text-sky-300 border border-sky-500/40"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              }`
            }
          >
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
            <span>Coding Copilot</span>
          </NavLink>
          <NavLink
            to="/summarizer"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-lg px-3 py-2 transition ${
                isActive
                  ? "bg-sky-500/15 text-sky-300 border border-sky-500/40"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              }`
            }
          >
            <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
            <span>Summarizer</span>
          </NavLink>
          <NavLink
            to="/knowledge-base"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-lg px-3 py-2 transition ${
                isActive
                  ? "bg-sky-500/15 text-sky-300 border border-sky-500/40"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              }`
            }
          >
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
            <span>Knowledge Base</span>
          </NavLink>
          <NavLink
            to="/web-search"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-lg px-3 py-2 transition ${
                isActive
                  ? "bg-sky-500/15 text-sky-300 border border-sky-500/40"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              }`
            }
          >
            <span className="h-1.5 w-1.5 rounded-full bg-pink-400" />
            <span>Web Search</span>
          </NavLink>
        </nav>

        <div className="mt-auto space-y-2 text-xs text-gray-400">
          {!ready && (
            <>
              <button
                onClick={loadModel}
                className="w-full rounded-lg bg-sky-600 hover:bg-sky-500 px-3 py-2 text-xs font-medium text-white shadow-sm shadow-sky-500/40"
              >
                Download / Load Model
              </button>
              <p>{status}</p>
              <div className="w-full h-1.5 rounded-full bg-neutral-900 overflow-hidden">
                <div
                  className="h-full bg-sky-400 transition-[width] duration-500 ease-out"
                  style={{ width: `${Math.round(progress * 100)}%` }}
                />
              </div>
              <p>{Math.round(progress * 100)}%</p>
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

      {/* Main area */}
      <main className="flex-1 flex flex-col px-8 py-6">
        <header className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Workspace</h2>
            <p className="text-xs text-gray-500">
              Switch between tools powered by the same in-browser model.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setModelMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-sky-500/40 px-4 md:px-6 py-1.5 text-xs text-gray-300 bg-white/5 hover:bg-sky-500/20 hover:border-sky-400 transition-colors min-w-[240px]"
              >
                <FiCpu className="h-3.5 w-3.5 text-sky-300" />
                <span className="hidden sm:inline text-gray-400">Model</span>
                <span className="flex-1 truncate text-gray-100 text-[11px] text-left">
                  {modelId.replace("-Instruct-q4f32_1-MLC", "")}
                </span>
                <FiChevronDown
                  className={`h-3 w-3 text-gray-400 transition-transform ${
                    modelMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {modelMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-white/10 bg-black/95 shadow-xl z-20">
                  <div className="px-3 pt-2 pb-1 text-[10px] uppercase tracking-wide text-gray-500">
                    WebGPU models
                  </div>
                  <ul className="max-h-64 overflow-auto text-xs">
                    {availableModels.map((id) => {
                      const isActive = id === modelId;
                      return (
                        <li key={id}>
                          <button
                            type="button"
                            onClick={() => {
                              setModelId(id);
                              setModelMenuOpen(false);
                            }}
                            className={`flex w-full items-center justify-between px-3 py-2 text-left ${
                              isActive
                                ? "bg-sky-500/20 text-sky-300"
                                : "text-gray-200 hover:bg-white/10 hover:text-sky-200"
                            }`}
                          >
                            <span className="truncate">
                              {id.replace("-Instruct-q4f32_1-MLC", "")}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="px-3 py-2 border-t border-white/10 text-[10px] text-gray-500">
                    Downloading multiple models can use significant local storage.
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <section className="mt-6 flex-1">
          <div className="h-full rounded-2xl border border-white/5 bg-gradient-to-br from-neutral-950/80 via-neutral-950/60 to-black/80 shadow-[0_0_40px_rgba(0,0,0,0.6)] p-6 overflow-hidden">
            <Outlet />
          </div>
        </section>
      </main>
    </div>
  );
}

