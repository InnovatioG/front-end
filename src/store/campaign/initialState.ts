import type { User } from '@/HardCode/databaseType';
import type { Campaign, MembersTeam, MilestoneCreation } from '@/types/types';

export interface CampaignState {
    step: 1 | 2 | 3 | 4;
    name: string;
    category_id: number | null;
    description: string;
    user: User | null;
    isLoading: boolean;
    newCampaign: {
        name: string;
        creator_wallet_id: number | null;
        campaign_status_id: number;
        campaing_category_id: number | null;
        contract_id: number;
        vizualization: number;
        requestMinAda: BigInt;
        description: string;
        logo_url: string;
        banner_url: string;
        start_date: string;
        end_date: string;
        requestMaxAda: BigInt;
        milestones: MilestoneCreation[];
        balance: number;
        createdAt: string;
        updatedAt: string;
        website: string;
        facebook: string;
        instagram: string;
        discord: string;
        twitter: string;

        members_team: MembersTeam[];
        selectedMember: MembersTeam | null; // Fix typo here
    };
}

export const initialState: CampaignState = {
    step: 1,
    name: '',
    category_id: null,
    description: '',
    user: null,
    isLoading: false,
    newCampaign: {
        creator_wallet_id: null,
        campaign_status_id: 1,
        campaing_category_id: null,
        logo_url: '',
        banner_url: '',
        milestones: [],
        requestMinAda: 0n,
        name: '',
        description: '',
        contract_id: 1,
        vizualization: 1,
        start_date: '',
        end_date: '',
        requestMaxAda: 20000n,
        balance: 0,
        createdAt: '',
        updatedAt: '',
        website: '',
        facebook: '',
        instagram: '',
        discord: '',
        twitter: '',
        members_team: [],
        selectedMember: null, // Fix typo here
    },
};
