import { CampaignState } from "@/store/campaign/initialState";
import type { User } from "@/HardCode/databaseType";
export const setTitleAction = (state: CampaignState, title: string) => {
  state.title = title;
};

export const setCategoryAction = (state: CampaignState, category: string) => {
  state.category = category;
};

export const setDescriptionAction = (
  state: CampaignState,
  description: string
) => {
  state.description = description;
};

export const setCategoryIdAction = (
  state: CampaignState,
  categoryId: number
) => {
  state.categoryId = categoryId;
};

export const setUserAction = (state: CampaignState, user: User) => {
  state.user = user;
};

export const setNextStepAction = (state: CampaignState) => {
  state.step += 1;
};

export const setPrevStepAction = (state: CampaignState) => {
  state.step -= 1;
};

export const createCampaignAction = (state: CampaignState) => {};
