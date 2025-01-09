export interface Campaign {
    _DB_id: string;
    creator_wallet_id: string;
    name: string;
    description?: string;
    campaign_status_id?: string;
    banner_url?: string;
    logo_url?: string;
    createdAt?: Date;
    updatedAt?: Date;
    investors?: number;
    requestMaxAda: bigint;
    requestMinAda: bigint;
    campaing_category_id: string;
    website?: string;
    facebook?: string;
    instagram?: string;
    discord?: string;
    twitter?: string;
    cdCollecedAda?: bigint;
    begin_at?: Date;
    deadline?: Date;
    milestones?: Milestone[];
    members_team?: MembersTeam[];
    cdFundedADA?: bigint;
    tokenomics_description?: string;
}

export interface Milestone {
    campaign_id: string;
    milestone_status_id: string;
    estimate_delivery_days: number;
    estimate_delivery_date: Date;
    percentage: number;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface MilestoneCreation {
    order: number;
    requestMaxAda: number;
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
    name: string;
}
