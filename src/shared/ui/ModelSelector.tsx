import { useEffect, useRef, useState } from "react";
import { FiCpu, FiChevronDown } from "react-icons/fi";
import { useModelStore } from "../model/store";

export function formatModelId(id: string): string {
  // Llama-style: ...-Instruct-XXX-MLC or ...-Instruct-XXX-MLC-1k
  const instructMatch = id.match(/^(.+)-Instruct-([a-zA-Z0-9_]+)-MLC(-1k)?$/);
  if (instructMatch) {
    return `${instructMatch[1]} (${instructMatch[2]})`;
  }
  // Snowflake Arctic Embed: ...-qXXX-MLC-bNN
  const snowflakeMatch = id.match(/^(.+)-(q[0-9a-zA-Z_]+)-MLC-b([0-9]+)$/);
  if (snowflakeMatch) {
    const base = snowflakeMatch[1].replace(/-/g, " ");
    const quant = snowflakeMatch[2];
    const batch = snowflakeMatch[3];
    const titleCase = base.replace(/\b\w/g, (c) => c.toUpperCase());
    return `${titleCase} (${quant}, b${batch})`;
  }
  // DeepSeek, Hermes, Mistral: ...-qXXX-MLC or ...-qXXX-MLC-1k
  const quantMatch = id.match(/^(.+)-(q[0-9a-zA-Z_]+)-MLC(-1k)?$/);
  if (quantMatch) {
    const base = quantMatch[1];
    const quant = quantMatch[2];
    const short = base.replace(/-Distill-/g, "-").replace(/-/g, " ");
    return `${short} (${quant})`;
  }
  return id;
}

export function ModelSelector() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { modelId, availableModels, setModelId } = useModelStore();

  useEffect(() => {
    if (!open) return;
    const onOutsideClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-violet-500/40 px-3 py-1.5 text-xs text-gray-300 bg-white/5 hover:bg-violet-500/20 hover:border-violet-400 transition-colors min-w-[240px]"
      >
        <FiCpu className="h-3.5 w-3.5 text-violet-300" />
        <span className="hidden sm:inline text-gray-400">Model</span>
        <span className="flex-1 truncate text-gray-100 text-[11px] text-left">
          {formatModelId(modelId)}
        </span>
        <FiChevronDown
          className={`h-3 w-3 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
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
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-3 py-2 text-left ${
                      isActive
                        ? "bg-violet-500/20 text-violet-300"
                        : "text-gray-200 hover:bg-white/10 hover:text-violet-200"
                    }`}
                  >
                    <span className="truncate">{formatModelId(id)}</span>
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
  );
}
