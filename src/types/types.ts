export interface Campaign {
    _DB_id?: string;
    creator_wallet_id?: string;
    name: string;
    description?: string;
    campaign_status_id?: string | null;
    banner_url?: string;
    logo_url?: string;
    createdAt?: Date;
    updatedAt?: Date;
    investors?: number;
    requestMaxAda: bigint;
    requestMinAda: bigint;
    campaing_category_id: string | null;
    website?: string;
    facebook?: string;
    instagram?: string;
    discord?: string;
    twitter?: string;
    cdCollecedAda?: bigint;
    begin_at?: Date;
    deadline?: Date;
    milestones?: Milestone[];
    campaign_content?: CampaignContent[];
    members_team?: MembersTeam[];
    faqs?: FAQ[];
    cdFundedADA?: bigint;
    tokenomics_description?: string;
    campaignToken_tn?: string;
    campaignToken_priceADA?: bigint;
    mint_campaignToken?: boolean;
    tokenomics_max_supply?: string;
    campaignToken_CS?: string;
}

export interface Milestone {
    _DB_id?: string;
    campaign_id: string;
    milestone_status_id: string;
    estimate_delivery_days: number;
    estimate_delivery_date: Date;
    percentage: number;
    description: string;
    createdAt: string;
    updatedAt: string;
    milestone_submissions?: MilestoneSubmission[];
}

export interface MilestoneCreation {
    order: number;
    requestMaxAda: number;
}

export interface MilestoneSubmission {
    _DB_id: string;
    milestone_id: string;
    submission_status_id?: string;
    report_proof_of_finalization?: string;
    approved_justification?: string;
    rejected_justification?: string;
}

export interface CampaignContent {
    campaign_id?: string;
    name?: string;
    description?: string;
    order?: number;
}

export interface FAQ {
    _DB_id?: string;
    campaign_id?: string;
    question?: string;
    answer?: string;
    order: number;
}

export interface MembersTeam {
    id: string;
    campaign_id: string;
    name: string | undefined;
    last_name: string | undefined;
    role?: string;
    editor?: boolean;
    admin?: boolean;
    email?: string;
    wallet_id?: string;
    wallet_address?: string;
    website?: string;
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    discord?: string;
    member_description?: string;
    twitter?: string;
    member_picture?: string;
    member_manage_funds?: boolean;
}

export interface CampaignCategory {
    id: number;
    name: string;
    description: string | undefined;
}

export interface CampaignStatusGlobal {
    id: string;
    id_internal: number;
    name: string;
    description: string | undefined;
}

export interface MilestoneStatusGlobal {
    id: number;
    id_internal: number;
    name: string;
}

export interface initialTextEditorOptionsType {
    order: number;
    name: string;
    tooltip: string;
}
