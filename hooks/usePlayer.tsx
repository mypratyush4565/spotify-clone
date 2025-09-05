"use client";

import { create } from "zustand";

interface PlayerStore {
  ids: string[];
  activeId?: string;
  isPlaying?: boolean;
  setId: (id: string) => void;
  setIds: (ids: string[]) => void;
  reset: () => void;
  setIsPlaying: (isPlaying: boolean) => void;
}

const usePlayer = create<PlayerStore>((set) => ({
  ids: [],
  activeId: undefined,
  isPlaying: false,
  setId: (id: string) => set({ activeId: id }),
  setIds: (ids: string[]) => set({ ids: ids }), // This line is now correct
  reset: () => set({ ids: [], activeId: undefined }),
  setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
}));

export default usePlayer;