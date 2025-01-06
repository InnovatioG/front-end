import type { User, Milestone } from '@/HardCode/databaseType';
import { MembersTeam } from '@/HardCode/databaseType';

export interface CampaignState {
    step: 1 | 2 | 3 | 4;
    name: string;
    category: string;
    category_id: number | null;
    description: string;
    user: User | null;
    isLoading: boolean;
    newCampaign: {
        id: number;
        creator_wallet_id: number | null;

        state_id: number;
        category_id: number | null;
        contract_id: number;
        vizualization: number;
        title: string;
        min_request: number;
        description: string;
        logo_url: string;
        banner_url: string;
        start_date: string;
        end_date: string;
        goal: number;
        milestones: Milestone[];
        balance: number;
        createdAt: string;
        updatedAt: string;
        website: string;
        facebook: string;
        instagram: string;
        discord: string;
        twitter: string;
        linkedin: string;

        members_team: MembersTeam[];
        selectedMember: MembersTeam | null; // Fix typo here
    };
}

export const initialState: CampaignState = {
    step: 1,
    name: '',
    category: '',
    category_id: null,
    description: '',
    user: null,
    isLoading: false,
    newCampaign: {
        id: Date.now(),
        creator_wallet_id: null,
        state_id: 1,
        category_id: null,
        logo_url: '',
        banner_url: '',
        milestones: [],
        min_request: 0,
        title: '',
        description: '',
        contract_id: 1,
        vizualization: 1,
        start_date: '',
        end_date: '',
        goal: 20000,
        balance: 0,

        createdAt: '',
        updatedAt: '',

        website: '',
        facebook: '',
        instagram: '',
        discord: '',
        twitter: '',
        linkedin: '',

        members_team: [],
        selectedMember: null, // Fix typo here
    },
};
