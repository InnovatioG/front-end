import type { User } from "@/HardCode/databaseType";

export interface CampaignState {
  step: 1 | 2 | 3 | 4;
  title: string;
  category: string;
  categoryId: number | null;
  description: string;
  user: User | null;
  isLoading: boolean;
  newCampaign: {
    id: number;
    user_id: number | null;
    state_id: number;
    category_id: number | null;
    contract_id: number;
    vizualization: number;
    title: string;
    description: string;
    company_logo: string;
    banner_image: string;
    start_date: string;
    end_date: string;
    goal: number;
    balance: number;
    created_at: string;
    updated_at: string;
  };
}

export const initialState: CampaignState = {
  step: 1,
  title: "",
  category: "",
  categoryId: null,
  description: "",
  user: null,
  isLoading: false,
  newCampaign: {
    id: Date.now(),
    user_id: null,
    state_id: 1,
    category_id: null,
    company_logo: "",
    banner_image: "",
    title: "",
    description: "",
    contract_id: 1,
    vizualization: 1,
    start_date: "",
    end_date: "",
    goal: 0,
    balance: 0,
    created_at: "",
    updated_at: "",
  },
};
