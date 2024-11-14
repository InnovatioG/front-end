import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
  ProjectDetailState,
  initialState,
} from "@/store/projectdetail/initialState";

interface UseProjectDetailStore extends ProjectDetailState {
  setProject: (project: ProjectDetailState["project"]) => void;
  setMenuView: (menuView: ProjectDetailState["menuView"]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string) => void;
}

export const useProjectDetailStore = create<UseProjectDetailStore>()(
  immer<UseProjectDetailStore>((set) => ({
    ...initialState,
    setProject: (project: ProjectDetailState["project"]) =>
      set((state) => {
        state.project = project;
      }),
    setIsLoading: (isLoading) =>
      set((state) => {
        state.isLoading = isLoading;
      }),
    setMenuView: (menuView) =>
      set((state) => {
        state.menuView = menuView;
      }),
    setError: (error) =>
      set((state) => {
        state.error = error;
      }),
  }))
);
