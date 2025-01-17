import { CampaignMemberApi } from '@/lib/SmartDB/FrontEnd';
import { CampaignMemberEntity } from '@/lib/SmartDB/Entities';
import type { MembersTeam } from '@/types/types';

export const createCampaignMembers = async (newMember: MembersTeam, campaignId: string | undefined) => {
    const campaignMemberEntity = new CampaignMemberEntity(newMember);
    if (campaignId !== undefined) {
        campaignMemberEntity.campaign_id = campaignId;
    }
    return await CampaignMemberApi.createApi(campaignMemberEntity);
}