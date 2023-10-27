import { create } from "zustand";

type CoverImageStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  urlToBeReplaced?: string;
  onReplace: (url: string) => void;
};

export const useCoverImageStore = create<CoverImageStore>((set, get) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true, urlToBeReplaced: undefined }),
  onClose: () => set({ isOpen: false, urlToBeReplaced: undefined }),
  onReplace: (url: string) => set({ isOpen: true, urlToBeReplaced: url }),
}));
