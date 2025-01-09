import type { Campaign, Milestone, MembersTeam } from '@/types/types';

export interface CampaignIdStore {
    campaign: Campaign;
    isLoading: boolean;
    menuView: 'Project Detail' | 'Resume of the team' | 'Roadmap & Milestones' | 'Tokenomics' | 'Q&A';
    error: string;
    milestone: Milestone | null; // Add this for active/selected milestone
    editionMode: boolean;
    isLoadingPrice: boolean;
    isAdmin: boolean;
    isProtocolTeam: boolean;
    price_ada: number;
}

export const initialState: CampaignIdStore = {
    campaign: {
        _DB_id: '',
        creator_wallet_id: 'null',
        name: '',
        description: '',
        campaign_status_id: '',
        investors: 0,
        banner_url: '',
        logo_url: '',
        createdAt: '',
        updatedAt: '',
        requestMaxAda: 0n,
        requestMinAda: 0n,
        website: '',
        facebook: '',
        instagram: '',
        discord: '',
        twitter: '',
        tokenomics_description: '',
        begin_at: undefined,
        deadline: undefined,
        members_team: [],
        milestones: [],
        faqs: [],
        campaign_content: [],
        category_id: 0,
        contract_id: 0,
        raise_amount: 0,
        cdRequestedMaxADA: 0,
        cdCampaignToken_PriceADA: 0,
        cdCampaignToken_TN: '',
        xs: '',
    },
    price_ada: 0,
    menuView: 'Project Detail',
    isLoading: false,
    error: '',
    milestone: null,
    editionMode: true,
    isAdmin: false,
    isProtocolTeam: false,
    isLoadingPrice: false,
};

/* 

matwitteruply, cuantos token existen de algo, 

el precio se calcula con la plata que el usuario quiere en total, y cuantos token el usuarios pone en la venta 





/* {
        id: number;
        creator_wallet_id: number | null;
        title: string;
        description: string;
        state_id: number;
        banner_url: string;
        logo_url: string;
        createdAt: string;
        updatedAt: string;
        investors: number;
        status: string;
        goal: number;
        min_request: number;
        cdRequestedMaxADA: number | null;
        cdCampaignToken_PriceADA: number | null;
        cdCampaignToken_TN: string;
        campaign_content: campaingContent[];
        tokenomics_description: string;
        vizualization?: number;
        website: string;
        facebook: string;
        instagram: string;
        discord: string;
        linkedin: string;
        start_date: string;
        twitter: string;
        category_id: number;
        contract_id?: number;
        raise_amount: number;
        members_team: MembersTeam[];
        milestones: MilestoneF[];
        faqs: FAQ[];
        end_date: string;
    }; */
