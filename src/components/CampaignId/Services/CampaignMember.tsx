import { CampaignMemberApi } from '@/lib/SmartDB/FrontEnd';
import { CampaignMemberEntity } from '@/lib/SmartDB/Entities';
import type { MembersTeam } from '@/types/types';

export const createCampaignMembers = async (newMember: MembersTeam, campaignId: string | undefined) => {
    console.log
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

        // Crear una copia del miembro sin la propiedad id
        const { id, member_description, ...memberWithoutId } = member;
        const memberWithDBId = { ...memberWithoutId, _DB_id: id };

        // Crear la entidad con _DB_id
        let entity = new CampaignMemberEntity(memberWithDBId);
        entity = await CampaignMemberApi.updateWithParamsApi_(memberWithDBId._DB_id, entity);

        console.log('Member updated successfully:', entity);
    } catch (error) {
        console.error('Error updating member:', error);
    }
};
