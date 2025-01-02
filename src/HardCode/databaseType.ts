export interface Version {
    version: string;
    stored_at: string;
}

export interface User {
    id: number;
    email: string;
    wallet_address: string;
    is_admin: boolean;
}

export interface Category {
    id: number;
    name: string;
}

export interface State {
    id: number;
    name: string;
}

export interface Contracts {
    id: number;
    name: string;
}

export interface Vizualization {
    id: number;
    name: string;
}

export interface Milestone {
    order: number;
    goal: number;
}

export interface BaseCampaign {
    id: number;
    user_id: number | null;
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
    xs: string;
    category_id: number;
    contract_id?: number;
    raise_amount: number;
    members_team: MembersTeam[];
    milestones: MilestoneF[];
    faqs: FAQ[];
    campaign_type: 'Target' | 'Milestone';
    end_date: string;
}

export interface MilestoneCampaign extends BaseCampaign {
    campaign_type: 'Milestone';
}

export interface TargetCampaign extends BaseCampaign {
    campaign_type: 'Target';
}

export type Campaign = MilestoneCampaign | TargetCampaign;

export interface DatabaseStructure {
    version: Version;
    users: User[];
    categories: Category[];
    states: State[];
    campaigns: Campaign[];
}

export interface Milestone_submission {
    id_milestione_submission: number;
    milestone_id: number;
    milestone_status_id: number;
    report_proof_of_finalization: string;
    approved_justification: string;
    rejected_justification: string;
}

export interface Campaign_Submission {
    id_campaign_submission: number;
    campaign_id: number;
    submission_status_id?: number;
    submittedby_wallet_id?: number;
    campaign_status_id: number;
    approved_justification: string;
    rejected_justification: string;
}

export interface Submission_Status {
    id_submission_status: number;
    name: string;
    description: string;
}

export interface MilestoneStatus {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    milestone_submission: Milestone_submission;
    updatedAt: string;
}

export interface CampaignStatus {
    id: number;
    name: string;
    campaign_submission?: Campaign_Submission;
    description: string;
    createdAt: string;
    updatedAt: string;
}
export interface MilestoneF {
    id: number;
    campaign_id: number;
    campaign_status_id: number;
    estimatedDeliveryDate: string;
    percentage: number;
    status: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    milestone_status?: MilestoneStatus;
    campaign_status?: CampaignStatus;
}
/* 
Campaign-Faqs
Son los bloques de texto de Q&A de la campaña

ID-Campaign-Faqs: Integer
Campaign-ID: Integer
ID de la campaña a la que pertenece esta Q&A
Name: String
Description: String
Order: Integer
CreatedAt: Date
UpdatedAt: Date
 */
export interface FAQ {
    name: string;
    description: string;
    order: number;
}

export interface MembersTeam {
    id: number;
    member_picture: string;
    member_name: string;
    member_last_name: string;
    member_role: string;
    member_description: string;
    member_email: string;
    member_admin: boolean;
    member_manage_funds: boolean;
    member_wallet_address: string;
    facebook: string;
    instagram: string;
    discord: string;
    xs: string;
}

export interface Project {
    id: number;
    title: string;
    description: string;
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
    website: string;
    facebook: string;
    instagram: string;
    discord: string;
    linkedin: string;
    xs: string;
    members_team: MembersTeam[];
    milestones: MilestoneF[];
    faqs: FAQ[];
}

export interface campaingContent {
    id: number;
    name: string;
    description: string;
    order: number;
}
