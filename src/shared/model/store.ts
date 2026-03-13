import { create } from "zustand";
import {
  initModel,
  AVAILABLE_MODELS,
  getCurrentModelId,
  setCurrentModelId,
} from "../../agent";
import type { ProgressCallback } from "../../agent";

type ModelState = {
  ready: boolean;
  progress: number;
  status: string;
  loading: boolean;
  modelId: string;
  availableModels: readonly string[];
  downloadedModels: string[];
  setModelId: (id: string) => void;
  loadModel: () => Promise<void>;
};

function loadDownloadedFromStorage(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem("webgpu-downloaded-models");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

function persistDownloaded(models: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      "webgpu-downloaded-models",
      JSON.stringify(models),
    );
  } catch {}
}

export const useModelStore = create<ModelState>((set, get) => ({
  ready: false,
  progress: 0,
  status: "",
  loading: false,
  modelId: getCurrentModelId(),
  availableModels: AVAILABLE_MODELS,
  downloadedModels: loadDownloadedFromStorage(),
  setModelId: (id: string) => {
    setCurrentModelId(id);
    set((state) => ({
      modelId: id,
      ready: false,
      progress: 0,
      status:
        "Model changed. Click load to download weights. Downloading many models will use additional disk space.",
      downloadedModels: state.downloadedModels,
    }));
  },
  loadModel: async () => {
    if (get().loading || get().ready) return;
    set({ loading: true });
    const onProgress: ProgressCallback = (p) => {
      set({
        progress: p.progress,
        status: p.text,
        ready: p.progress === 1,
      });
    };
    try {
      await initModel(onProgress);
      const id = get().modelId;
      set((state) => {
        if (state.downloadedModels.includes(id)) return state;
        const next = [...state.downloadedModels, id];
        persistDownloaded(next);
        return { ...state, downloadedModels: next };
      });
    } finally {
      set({ loading: false });
    }
  },
}));

