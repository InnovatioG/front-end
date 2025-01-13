import { useCampaignStore } from '@/store/campaign/useCampaignStore';
import { useState, useEffect } from 'react';
import type { MembersTeam } from '@/types/types';
type SocialLinkKeys = 'website' | 'facebook' | 'instagram' | 'discord' | 'twitter';

export default function useStepFour() {
    const { newCampaign, newMember, addMemberToTeam, resetNewMember, setNewMemberField, updateMemberField } = useCampaignStore();

    const [selectedLink, setSelectedLink] = useState<SocialLinkKeys>('website');
    const isEditing = newMember.id && newCampaign.members_team.some((m) => m.id === newMember.id);

    const handleSaveMember = () => {
        if (isEditing) {
            // Update existing member
            Object.keys(newMember).forEach((key) => {
                updateMemberField(key as keyof MembersTeam, newMember[key as keyof MembersTeam]);
            });
        } else {
            // Add new member with new id
            const memberToAdd = {
                ...newMember,
            };
            addMemberToTeam(memberToAdd);
        }
        resetNewMember();
    };
    const disabledSaveMember = !newMember.name || !newMember.member_description || !newMember.last_name || !newMember.role || !newMember.email;

    return {
        selectedLink,
        setSelectedLink,
        handleSaveMember,
        disabledSaveMember,
        isEditing,
    };
}
