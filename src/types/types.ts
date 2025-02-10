import { CampaignContentEntity, CampaignEntity, CampaignFaqsEntity, CampaignMemberEntity, MilestoneEntity, MilestoneSubmissionEntity } from "@/lib/SmartDB/Entities";

export interface CampaignEX {
    campaign: CampaignEntity;
    milestones?: MilestoneEX[];
    contents?: CampaignContentEntity[];
    members?: CampaignMemberEntity[];
    faqs?: CampaignFaqsEntity[];
}

export interface MilestoneEX {
    milestone: MilestoneEntity;
    milestone_submissions?: MilestoneSubmissionEntity[];
}

export interface initialTextEditorOptionsType {
    order: number;
    name: string;
    tooltip: string;
}
