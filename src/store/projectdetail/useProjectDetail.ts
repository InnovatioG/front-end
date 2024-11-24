import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
  ProjectDetailState,
  initialState,
} from "@/store/projectdetail/initialState";

interface UseProjectDetailStore extends ProjectDetailState {
  setProject: (project: ProjectDetailState["project"]) => void;
  setMenuView: (menuView: ProjectDetailState["menuView"]) => void;
  setMilestone: (milestone: ProjectDetailState["milestone"]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string) => void;
  setEditionMode: (editionMode: boolean) => void;
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
    setMilestone: (milestone) =>
      set((state) => {
        state.milestone = milestone;
      }),
    setEditionMode: (editionMode) =>
      set((state) => {
        state.editionMode = editionMode;
      }),
  }))
);
