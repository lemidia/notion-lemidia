import { create } from "zustand";

type NavigationStore = {
  isCollapsed: boolean;
  onCollapsed: () => void;
  onExpand: () => void;
};

export const useNavigationStore = create<NavigationStore>((set, get) => ({
  isCollapsed: false,
  onCollapsed: () => set({ isCollapsed: true }),
  onExpand: () => set({ isCollapsed: false }),
}));
