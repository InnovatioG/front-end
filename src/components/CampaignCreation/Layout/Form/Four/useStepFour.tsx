import { useCampaignStore } from '@/store/campaign/useCampaignStore';
import { useState, useEffect } from 'react';
import type { MembersTeam } from '@/types/types';
import { useWalletStore } from 'smart-db';
import type { MilestoneCreation } from '@/types/types';
import { createCampaign } from '@/components/CampaignCreation/Services/CampaignCreationServices';

type SocialLinkKeys = 'website' | 'facebook' | 'instagram' | 'discord' | 'twitter';

export default function useStepFour() {
    const { newCampaign, newMember, addMemberToTeam, resetNewMember, setNewMemberField, updateMemberField } = useCampaignStore();

    /* usar el wallet store para la info del usuario */

    const walletStore = useWalletStore();
    const address = walletStore.info?.address || '';

    useEffect(() => {
        console.log(newCampaign.milestones)
    }, [])




    const [selectedLink, setSelectedLink] = useState<SocialLinkKeys>('website');
    const isEditing = newMember.id && newCampaign.members_team.some((m) => m.id === newMember.id);

    const handleSaveMember = () => {
        if (isEditing) {
            Object.keys(newMember).forEach((key) => {
                updateMemberField(key as keyof MembersTeam, newMember[key as keyof MembersTeam]);
            });
        } else {
            const memberToAdd = {
                ...newMember,
            };
            addMemberToTeam(memberToAdd);
        }
        resetNewMember();
    };

    const handleCreateCampaign = async () => {
        handleSaveMember();
        try {
            await createCampaign(newCampaign, address);
        } catch (error) {
            console.error('Error creating campaign:', error);
        }
    }






    const disabledSaveMember = !newMember.name || !newMember.member_description || !newMember.last_name || !newMember.role || !newMember.email;

    return {
        selectedLink,
        setSelectedLink,
        handleSaveMember,
        disabledSaveMember,
        isEditing,
        address,
        handleCreateCampaign
    };
}
