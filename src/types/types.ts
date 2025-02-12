import { CampaignContentEntity, CampaignEntity, CampaignFaqsEntity, CampaignMemberEntity, CampaignSubmissionEntity, MilestoneEntity, MilestoneSubmissionEntity } from "@/lib/SmartDB/Entities";

export interface CampaignEX {
    campaign: CampaignEntity;
    campaign_submissions?: CampaignSubmissionEntity[];
    campaign_submissions_deleted?: CampaignSubmissionEntity[]; // Track deleted

    milestones?: MilestoneEX[];
    milestones_deleted?: MilestoneEX[];

    contents?: CampaignContentEntity[];
    contents_deleted?: CampaignContentEntity[];

    members?: CampaignMemberEntity[];
    members_deleted?: CampaignMemberEntity[];

    faqs?: CampaignFaqsEntity[];
    faqs_deleted?: CampaignFaqsEntity[];
}

export interface MilestoneEX {
    milestone: MilestoneEntity;
    milestone_submissions?: MilestoneSubmissionEntity[];
    milestone_submissions_deleted?: MilestoneSubmissionEntity[];
}

export interface initialTextEditorOptionsType {
    order: number;
    name: string;
    tooltip: string;
}
