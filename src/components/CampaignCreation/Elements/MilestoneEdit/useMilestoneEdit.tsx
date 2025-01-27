import { useEffect } from 'react';
import { getOrdinalString } from '@/utils/formats';
import { Milestone } from '@/types/types';
import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';
import { updateMilestoneInformation } from '@/components/CampaignId/Services/Milestone';
interface UseMilestoneCardEditReturn {
    ordinalString: string;
    handleDescriptionChange: (content: string) => void;
    handleUpdateMilestone: (milestone: Milestone) => Promise<void>;
}

const useMilestoneCardEdit = (
    index: number,
    milestone: Milestone
): UseMilestoneCardEditReturn => {
    const ordinalString = getOrdinalString(index + 1);
    const { setCampaign, campaign } = useCampaignIdStore();



    const handleDescriptionChange = (content: string) => {
        setCampaign({
            ...campaign,
            milestones: campaign.milestones?.map((item) =>
                item._DB_id === milestone._DB_id
                    ? { ...item, description: content }
                    : item
            ),
        });
    };

    const handleUpdateMilestone = async (milestone: Milestone) => {
        try {
            await updateMilestoneInformation(milestone);
        } catch (error) {
            console.error('Error al actualizar el milestone:', error);
        }
    };



    return {
        ordinalString,
        handleDescriptionChange,
        handleUpdateMilestone
    };
};

export default useMilestoneCardEdit;