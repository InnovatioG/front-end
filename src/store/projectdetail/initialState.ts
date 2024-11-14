import type { MembersTeam } from "../campaign/initialState";

export interface ProjectDetailState {
  project: {
    id: number;
    title: string;
    description: string;
    banner_image: string;
    company_logo: string;
    created_at: string;
    updated_at: string;
    investors: number;
    status: string;
    /*    | "TBL"
      | "Countdown"
      | "Fundraising"
      | "Finishing"
      | "Active"
      | "Sucess"
      | "Failed"
      | "Unreached"
      | "Archived"; */
    goal: number;
    min_request: number;

    brand: {
      website: string;
      facebook: string;
      instagram: string;
      discord: string;
      x: string;
    };
    members_team: MembersTeam[];
  };
  isLoading: boolean;
  menuView:
    | "Project Detail"
    | "Resume of the team"
    | "Roadmap & Milestones"
    | "Tokenomics"
    | "Q&A";
  error: string;
}

export const initialState: ProjectDetailState = {
  project: {
    id: 0,
    title: "",
    description: "",
    investors: 0,
    banner_image: "",
    company_logo: "",
    created_at: "",
    updated_at: "",
    status: "",
    goal: 0,
    min_request: 0,
    brand: {
      website: "",
      facebook: "",
      instagram: "",
      discord: "",
      x: "",
    },
    members_team: [],
  },
  menuView: "Project Detail",
  isLoading: false,
  error: "",
};
