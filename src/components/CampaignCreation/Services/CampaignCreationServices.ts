import { CampaignEntity, MilestoneEntity, CampaignMemberEntity } from '@/lib/SmartDB/Entities';
import { CampaignApi, MilestoneApi, CampaignMemberApi } from '@/lib/SmartDB/FrontEnd';
import type { Campaign, MilestoneCreation } from '@/types/types';
import { MilestoneStatus } from '@/utils/constants/status';
import type { newCampaign } from '@/store/campaign/initialState';
import type { MembersTeam } from '@/types/types';

export const createCampaignEntity = async (newCampaign: newCampaign, address: string) => {
    const filteredCampaign = {
        name: newCampaign.name,
        creator_wallet_id: address,
        campaign_status_id: newCampaign.campaign_status_id,
        campaing_category_id: newCampaign.campaing_category_id,
        requestMinADA: newCampaign.requestMinADA,
        description: newCampaign.description,
        logo_url: newCampaign.logo_url,
        banner_url: newCampaign.banner_url,
        requestMaxADA: newCampaign.requestMaxADA,
        website: newCampaign.website,
        deadline_days: newCampaign.deadline_days,
        facebook: newCampaign.facebook,
        instagram: newCampaign.instagram,
        discord: newCampaign.discord,
        twitter: newCampaign.twitter,
    };

    const entity = new CampaignEntity(filteredCampaign);
    return await CampaignApi.createApi(entity);
};

export const createCampaignMembers = async (members: MembersTeam[], campaignId: string) => {
    const membersCreation = members.map((member) => ({
        ...member,
        campaign_id: campaignId,
    }));

    const campaignMemberEntities = membersCreation.map((member) => new CampaignMemberEntity(member));
    return await Promise.all(campaignMemberEntities.map((campaignMemberEntity) => CampaignMemberApi.createApi(campaignMemberEntity)));
};

export const createMilestones = async (milestones: MilestoneCreation[], campaignId: string) => {
    const milestonesCreation = milestones.map((milestone) => ({
        ...milestone,
        campaign_id: campaignId,
        milestone_status_id: MilestoneStatus.NOT_STARTED,
    }));

    const milestoneEntities = milestonesCreation.map((milestone) => new MilestoneEntity(milestone));

    return await Promise.all(milestoneEntities.map((milestoneEntity) => MilestoneApi.createApi(milestoneEntity)));
};

export const createCampaign = async (newCampaign: newCampaign, address: string) => {
    try {
        const campaignEntity = await createCampaignEntity(newCampaign, address);

        if (newCampaign.members_team?.length > 0) {
            await createCampaignMembers(newCampaign.members_team, campaignEntity._DB_id);
        }

        if (newCampaign.milestones?.length > 0) {
            await createMilestones(newCampaign.milestones, campaignEntity._DB_id);
        }
        return campaignEntity; // Devolver la entidad de la campaña creada
    } catch (error) {
        console.error('Error creating campaign:', error);
    }
};
