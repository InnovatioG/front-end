import type { User, Milestone } from "@/HardCode/databaseType";

export interface MembersTeam {
  id: number;
  member_picture: string;
  member_name: string;
  member_last_name: string;
  member_role: string;
  member_description: string;
  member_email: string;
  member_admin: boolean;
  member_social: {
    facebook: string;
    instagram: string;
    discord: string;
    x: string;
  };
}

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
    min_request: number;
    description: string;
    company_logo: string;
    banner_image: string;
    start_date: string;
    end_date: string;
    goal: number;
    milestones: Milestone[];
    balance: number;
    created_at: string;
    updated_at: string;
    brand: {
      website: string;
      facebook: string;
      instagram: string;
      discord: string;
      x: string;
    };
    members_team: MembersTeam[];
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
    milestones: [],
    min_request: 0,
    title: "",
    description: "",
    contract_id: 1,
    vizualization: 1,
    start_date: "",
    end_date: "",
    goal: 20000,
    balance: 0,

    created_at: "",
    updated_at: "",

    brand: {
      website: "",
      facebook: "",
      instagram: "",
      discord: "",
      x: "",
    },

    members_team: [],
  },
};
