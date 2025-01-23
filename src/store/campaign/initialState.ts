import type { User } from '@/HardCode/databaseType';
import type { Campaign, MembersTeam, MilestoneCreation } from '@/types/types';

export interface newCampaign {
    name: string;
    campaign_status_id: string;
    campaing_category_id: string | null;
    requestMinADA: bigint;
    description: string;
    logo_url: string;
    banner_url: string;
    start_date: string;
    end_date: string;
    requestMaxADA: bigint;
    milestones: MilestoneCreation[];
    balance: number;
    website: string;
    facebook: string;
    instagram: string;
    discord: string;
    twitter: string;

    members_team: MembersTeam[];
    selectedMember: MembersTeam | null; // Fix typo here
}

export interface CampaignState {
    step: 1 | 2 | 3 | 4;
    name: string;
    category_id: number | null;
    description: string;
    user: User | null;
    isLoading: boolean;
    newCampaign: newCampaign;
}

export const initialState: CampaignState = {
    step: 1,
    name: '',
    category_id: null,
    description: '',
    user: null,
    isLoading: false,
    newCampaign: {
        campaign_status_id: '1',
        campaing_category_id: '1',
        logo_url: '',
        banner_url: '',
        milestones: [],
        requestMinADA: 0n,
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        requestMaxADA: 20000n,
        balance: 0,
        website: '',
        facebook: '',
        instagram: '',
        discord: '',
        twitter: '',
        members_team: [],
        selectedMember: null, // Fix typo here
    },
};
