import { create } from "zustand";

export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: number;
};

type KnowledgeBaseState = {
  notes: Note[];
  addNote: (title: string, content: string) => void;
};

export const useKnowledgeBaseStore = create<KnowledgeBaseState>((set) => ({
  notes: [],
  addNote: (title, content) =>
    set((state) => ({
      notes: [
        ...state.notes,
        {
          id: crypto.randomUUID(),
          title,
          content,
          createdAt: Date.now(),
        },
      ],
    })),
}));

