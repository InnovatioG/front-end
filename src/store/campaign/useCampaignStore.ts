import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { CampaignState, initialState } from "@/store/campaign/initialState";
import {
  setTitleAction,
  setCategoryAction,
  setDescriptionAction,
  setCategoryIdAction,
  setUserAction,
} from "@/store/campaign/actions";
import type { User } from "@/HardCode/databaseType";

interface UseCampaignStore extends CampaignState {
  setStep: (step: 1 | 2 | 3 | 4) => void;
  setTitle: (title: string) => void;
  setCategory: (category: string) => void;
  setCategoryId: (categoryId: number | null) => void;
  setDescription: (description: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  setUser: (user: User) => void;
}

export const useCampaignStore = create<UseCampaignStore>()(
  immer<UseCampaignStore>((set) => ({
    ...initialState,
    setStep: (step) =>
      set((state) => {
        state.step = step;
      }),
    setTitle: (title) =>
      set((state) => {
        setTitleAction(state, title);
      }),
    setCategory: (category) =>
      set((state) => {
        setCategoryAction(state, category);
      }),
    setDescription: (description) =>
      set((state) => {
        setDescriptionAction(state, description);
      }),
    setIsLoading: (isLoading) =>
      set((state) => {
        state.isLoading = isLoading;
      }),
    setCategoryId: (categoryId) =>
      set((state) => {
        state.categoryId = categoryId;
      }),
    setUser: (user) =>
      set((state) => {
        setUserAction(state, user);
      }),
  }))
);
