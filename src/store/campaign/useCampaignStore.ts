import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { CampaignState, initialState } from "@/store/campaign/initialState";
import {
  setCampaignStateAction,
  setNestedCampaignStateAction,
  setNextStepAction,
  setPrevStepAction,
} from "@/store/campaign/actions";
import type { User, Milestone } from "@/HardCode/databaseType";

/* export interface Milestone {
  order: number;
  goal: number;
} */

interface UseCampaignStore extends CampaignState {
  setStep: (step: 1 | 2 | 3 | 4) => void;
  setTitle: (title: string) => void;
  setCategory: (category: string) => void;
  setCategoryId: (categoryId: number | null) => void;
  setDescription: (description: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  setUser: (user: User) => void;
  nextStep: () => void;
  prevStep: () => void;
  setCompanyLogo: (companyLogo: string) => void;
  setBanner: (banner: string) => void;
  setGoal: (goal: number) => void;
  setMilestones: (milestones: Milestone[]) => void;
  setMinRequest: (minRequest: number) => void;
}

export const useCampaignStore = create<UseCampaignStore>()(
  immer<UseCampaignStore>((set) => ({
    ...initialState,
    setStep: (step) =>
      set((state) => {
        setCampaignStateAction(state, "step", step);
      }),
    setTitle: (title) =>
      set((state) => {
        setCampaignStateAction(state, "title", title);
      }),
    setCategory: (category) =>
      set((state) => {
        setCampaignStateAction(state, "category", category);
      }),
    setCategoryId: (categoryId) =>
      set((state) => {
        setCampaignStateAction(state, "categoryId", categoryId);
      }),
    setDescription: (description) =>
      set((state) => {
        setCampaignStateAction(state, "description", description);
      }),
    setIsLoading: (isLoading) =>
      set((state) => {
        setCampaignStateAction(state, "isLoading", isLoading);
      }),
    setUser: (user) =>
      set((state) => {
        setCampaignStateAction(state, "user", user);
      }),
    setCompanyLogo: (companyLogo) =>
      set((state) => {
        setNestedCampaignStateAction(state, "company_logo", companyLogo);
      }),
    nextStep: () =>
      set((state) => {
        setNextStepAction(state);
      }),
    prevStep: () =>
      set((state) => {
        setPrevStepAction(state);
      }),
    setBanner: (banner) =>
      set((state) => {
        setNestedCampaignStateAction(state, "banner_image", banner);
      }),
    setGoal: (goal) =>
      set((state) => {
        setNestedCampaignStateAction(state, "goal", goal);
      }),
    setMilestones: (milestones) =>
      set((state) => {
        setNestedCampaignStateAction(state, "milestones", milestones);
      }),
    setMinRequest: (minRequest) =>
      set((state) => {
        setNestedCampaignStateAction(state, "min_request", minRequest);
      }),
  }))
);
