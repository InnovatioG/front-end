import type { MembersTeam } from '../campaign/initialState';
import type { MilestoneF, FAQ, campaingContent } from '@/HardCode/databaseType';

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

        goal: number;
        min_request: number;
        cdRequestedMaxADA: number | null;
        cdCampaignToken_PriceADA: number | null;
        cdCampaignToken_TN: string;

        campaign_content: campaingContent[];
        tokenomics_description: string;

        brand: {
            website: string;
            facebook: string;
            instagram: string;
            discord: string;
            linkedin: string;
            xs: string;
        };
        members_team: MembersTeam[];
        milestones: MilestoneF[];
        faqs: FAQ[];
    };
    isLoading: boolean;
    menuView: 'Project Detail' | 'Resume of the team' | 'Roadmap & Milestones' | 'Tokenomics' | 'Q&A';
    error: string;
    milestone: MilestoneF | null; // Add this for active/selected milestone
    editionMode: boolean;
    isLoadingPrice: boolean;
    price_ada: number;
}

export const initialState: ProjectDetailState = {
    project: {
        id: 0,
        title: '',
        description: '',
        investors: 0,
        banner_image: '',
        company_logo: '',
        created_at: '',
        updated_at: '',
        status: '',
        goal: 0,
        min_request: 0,
        brand: {
            website: '',
            facebook: '',
            instagram: '',
            linkedin: '',
            discord: '',
            xs: '',
        },
        cdRequestedMaxADA: null,
        cdCampaignToken_PriceADA: null,
        cdCampaignToken_TN: '',
        tokenomics_description: '',
        members_team: [],
        milestones: [],
        faqs: [],
        campaign_content: [],
    },
    price_ada: 0,
    menuView: 'Project Detail',
    isLoading: false,
    error: '',
    milestone: null,
    editionMode: true,
    isLoadingPrice: false,
};

/* 

maxSuply, cuantos token existen de algo, 

el precio se calcula con la plata que el usuario quiere en total, y cuantos token el usuarios pone en la venta 





*/
