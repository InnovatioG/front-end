import { CampaignEntity } from '@/lib/SmartDB/Entities';
import { MilestoneEntity, CampaignMemberEntity } from '@/lib/SmartDB/Entities';
import type { Campaign, Milestone, MembersTeam } from '@/types/types';
import { CampaignApi, CampaignMemberApi, MilestoneApi } from '@/lib/SmartDB/FrontEnd';

export const transformToBaseCampaign = async (campaign: CampaignEntity): Promise<Campaign> => {
    const milestonesEntities: MilestoneEntity[] = await MilestoneApi.getByParamsApi_({ campaign_id: campaign._DB_id });
    const membersTeamEntities: CampaignMemberEntity[] = await CampaignMemberApi.getByParamsApi_({ campaign_id: campaign._DB_id });
    const members_team: MembersTeam[] = membersTeamEntities.map((member) => ({
        id: member._DB_id,
        campaign_id: member.campaign_id,
        name: member.name,
        last_name: member.last_name,
        role: member.role,
        admin: member.admin,
        email: member.email,
        wallet_id: member.wallet_id,
        wallet_address: member.wallet_address,
        website: member.website,
        instagram: member.instagram,
        facebook: member.facebook,
        discord: member.discord,
        twitter: member.twitter,
    }));

    const milestones: Milestone[] = milestonesEntities.map((milestone) => ({
        campaign_id: milestone.campaign_id,
        milestone_status_id: milestone.milestone_status_id,
        estimate_delivery_days: milestone.estimate_delivery_days,
        estimate_delivery_date: milestone.estimate_delivery_date,
        percentage: milestone.percentage,
        description: milestone.description,
        createdAt: milestone.createdAt.toISOString(),
        updatedAt: milestone.updatedAt?.toISOString() || '',
    }));

    return {
        _DB_id: campaign._DB_id,
        creator_wallet_id: campaign.creator_wallet_id,
        name: campaign.name,
        description: campaign.description,
        campaign_status_id: campaign.campaign_status_id,
        banner_url: campaign.banner_url,
        logo_url: campaign.logo_url,
        createdAt: campaign.createdAt,
        updatedAt: campaign.updatedAt,
        investors: campaign.investors,
        requestMaxADA: campaign.requestedMaxADA,
        campaing_category_id: campaign.campaing_category_id,
        requestMinADA: campaign.requestedMinADA,
        website: campaign.website,
        facebook: campaign.facebook,
        instagram: campaign.instagram,
        discord: campaign.discord,
        twitter: campaign.twitter,
        milestones,
        members_team,
        begin_at: campaign.begin_at,
        deadline: campaign.deadline,
        cdFundedADA: campaign.cdFundedADA,
        tokenomics_description: campaign.tokenomics_description,
    };
};
