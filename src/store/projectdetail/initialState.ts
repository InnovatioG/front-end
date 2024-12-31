import type { MembersTeam } from '../campaign/initialState';
import type { MilestoneF, FAQ, campaingContent } from '@/HardCode/databaseType';

export interface ProjectDetailState {
    project: {
        id: number;
        user_id: number | null;
        title: string;
        description: string;
        state_id: number;
        banner_url: string;
        logo_url: string;
        created_at: string;
        updated_at: string;
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
        xs: string;
        category_id: number;
        contract_id?: number;
        raise_amount: number;
        members_team: MembersTeam[];
        milestones: MilestoneF[];
        faqs: FAQ[];
        campaign_type: 'Target' | 'Milestone';
        end_date: string;
    };
    isLoading: boolean;
    menuView: 'Project Detail' | 'Resume of the team' | 'Roadmap & Milestones' | 'Tokenomics' | 'Q&A';
    error: string;
    milestone: MilestoneF | null; // Add this for active/selected milestone
    editionMode: boolean;
    isLoadingPrice: boolean;
    isAdmin: boolean;
    isProtocolTeam: boolean;
    price_ada: number;
}

export const initialState: ProjectDetailState = {
    project: {
        user_id: null,
        id: 0,
        title: '',
        description: '',
        state_id: 0,
        investors: 0,
        banner_url: '',
        logo_url: '',
        created_at: '',
        updated_at: '',
        status: '',
        goal: 0,
        min_request: 0,
        website: '',
        facebook: '',
        instagram: '',
        discord: '',
        linkedin: '',
        xs: '',
        cdRequestedMaxADA: null,
        cdCampaignToken_PriceADA: null,
        cdCampaignToken_TN: '',
        tokenomics_description: '',
        start_date: '',
        end_date: '',
        members_team: [],
        milestones: [],
        faqs: [],
        campaign_content: [],
        vizualization: 0,
        category_id: 0,
        contract_id: 0,
        raise_amount: 0,
        campaign_type: 'Target',
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

maxSuply, cuantos token existen de algo, 

el precio se calcula con la plata que el usuario quiere en total, y cuantos token el usuarios pone en la venta 





*/
