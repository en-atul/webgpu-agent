import { CreateMLCEngine, MLCEngine, prebuiltAppConfig } from "@mlc-ai/web-llm";
let engine: MLCEngine | null = null;

type PrebuiltModelEntry = {
  model_id: string;
  model_url?: string;
  estimated_vram_bytes?: number;
};

const PREBUILT_LIST: PrebuiltModelEntry[] =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ((prebuiltAppConfig as any)?.model_list as PrebuiltModelEntry[]) ?? [];

export const AVAILABLE_MODELS: readonly string[] =
  PREBUILT_LIST.map((m) => m.model_id) ??
  ["Llama-3.2-1B-Instruct-q4f32_1-MLC"];

export const DEFAULT_MODEL =
  AVAILABLE_MODELS[0] ?? "Llama-3.2-1B-Instruct-q4f32_1-MLC";

let currentModelId: string = DEFAULT_MODEL;

export type ProgressCallback = (progress: {
  progress: number;
  text: string;
}) => void;

export function getCurrentModelId(): string {
  return currentModelId;
}

export function setCurrentModelId(id: string) {
  if (currentModelId === id) return;
  currentModelId = id;
  engine = null;
}

export async function initModel(onProgress?: ProgressCallback): Promise<MLCEngine> {
  if (engine) return engine;

  engine = await CreateMLCEngine(currentModelId, {
    appConfig: prebuiltAppConfig,
    initProgressCallback: (p) => {
      onProgress?.({
        progress: p.progress,
        text: p.text,
      });
    },
  });

  return engine;
}

export function getEngine(): MLCEngine | null {
  return engine;
}

export async function runAgent(prompt: string): Promise<string> {
  const engine = await initModel();

  const response = await engine.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return response.choices[0].message.content ?? "";
}

export type ChatMessage = { role: "user" | "assistant"; content: string };

export async function runAgentStream(args: {
  prompt?: string;
  messages?: ChatMessage[];
  systemPrompt?: string;
  onDelta: (deltaText: string) => void;
}): Promise<string> {
  const engine = await initModel();

  const messages: { role: "user" | "assistant" | "system"; content: string }[] = [];
  if (args.systemPrompt) {
    messages.push({ role: "system", content: args.systemPrompt });
  }
  if (args.messages?.length) {
    messages.push(...args.messages);
  } else if (args.prompt) {
    messages.push({ role: "user", content: args.prompt });
  }

  const chunks = (await engine.chat.completions.create({
    messages,
    stream: true,
  })) as AsyncIterable<unknown>;

  let full = "";
  for await (const chunk of chunks) {
    const delta =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (chunk as any)?.choices?.[0]?.delta?.content ?? "";
    if (typeof delta === "string" && delta.length) {
      full += delta;
      args.onDelta(delta);
    }
  }
  return full;
}
