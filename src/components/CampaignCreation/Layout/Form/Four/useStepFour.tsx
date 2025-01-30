import { useCampaignStore } from '@/store/campaign/useCampaignStore';
import { useState } from 'react';
import type { MembersTeam } from '@/types/types';
import { useWalletStore } from 'smart-db';
import { createCampaign } from '@/components/CampaignCreation/Services/CampaignCreationServices';
import { useRouter } from 'next/router';

type SocialLinkKeys = 'website' | 'facebook' | 'instagram' | 'discord' | 'twitter';

export default function useStepFour() {
    const { newCampaign, newMember, addMemberToTeam, resetNewMember, setNewMemberField, updateMemberField, setSelectedMember } = useCampaignStore();

    const walletStore = useWalletStore();
    const address = walletStore.info?.address || '';
    const router = useRouter();

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
                id: new Date().getTime().toString(), // Generar un ID único para el nuevo miembro
            };
            addMemberToTeam(memberToAdd);
        }
        resetNewMember();
    };

    const handleCreateCampaign = async () => {
        if (newMember.name || newMember.member_description || newMember.last_name || newMember.role || newMember.email) {
            handleSaveMember();
        }
        try {
            const campaignEntity = await createCampaign(newCampaign, address);
            if (campaignEntity) {
                router.push(`/campaign/edit?id=${campaignEntity._DB_id}`);
            } else {
                console.error('Campaign entity is undefined');
            }
        } catch (error) {
            console.error('Error creating campaign:', error);
        }
    };

    const disabledSaveMember = !newMember.name || !newMember.member_description || !newMember.last_name || !newMember.role || !newMember.email;

    return {
        selectedLink,
        setSelectedLink,
        handleSaveMember,
        disabledSaveMember,
        isEditing,
        address,
        handleCreateCampaign,
        setSelectedMember,
    };
}