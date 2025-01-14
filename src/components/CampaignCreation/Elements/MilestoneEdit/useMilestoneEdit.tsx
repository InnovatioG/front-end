import { useEffect } from 'react';
import { getOrdinalString } from '@/utils/formats';
import { Milestone } from '@/types/types';
import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';

interface UseMilestoneCardEditReturn {
    ordinalString: string;
    handleDescriptionChange: (content: string) => void;
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
                item._Db_id === milestone._Db_id
                    ? { ...item, description: content }
                    : item
            ),
        });
    };

    return {
        ordinalString,
        handleDescriptionChange,
    };
};

export default useMilestoneCardEdit;