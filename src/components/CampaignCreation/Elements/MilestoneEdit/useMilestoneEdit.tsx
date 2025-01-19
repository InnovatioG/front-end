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

    useEffect(() => {
        console.log('Milestone actualizado: ', milestone);
    }, [milestone]);

    const handleDescriptionChange = (content: string) => {
        console.log('Nuevo contenido:', content);
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
            console.log('Milestone actualizado: ', milestone);
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