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



export const updateMember = async (member: MembersTeam) => {

    try {
        if (member.id === undefined) {
            throw new Error('Member ID is undefined');
        }

        let entity = new CampaignMemberEntity(member);
        entity = await CampaignMemberApi.updateWithParamsApi_(member.id, entity);

        console.log('Member updated successfully:', entity);

    } catch (error) {
        console.error('Error updating member:', error);

    }

}