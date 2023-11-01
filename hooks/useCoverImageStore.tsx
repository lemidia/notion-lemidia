import { create } from "zustand";

type CoverImageStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  storageIdToBeReplaced?: string;
  onReplace: (url: string) => void;
};

export const useCoverImageStore = create<CoverImageStore>((set, get) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true, storageIdToBeReplaced: undefined }),
  onClose: () => set({ isOpen: false, storageIdToBeReplaced: undefined }),
  onReplace: (url: string) => set({ isOpen: true, storageIdToBeReplaced: url }),
}));
