import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';
import { handlePercentageChange } from '@/hooks/projectEditionContainerHandlers';

const useRoadmap = () => {
    const { campaign, setCampaign } = useCampaignIdStore();

    const { milestones } = campaign;
    const handlePercentageChangeWrapper = (milestone_id: string | undefined, newPercentage: number) => {
        if (milestones !== undefined && milestone_id !== undefined) {
            return handlePercentageChange(milestone_id, newPercentage, milestones, setCampaign, campaign);
        }
        return false;
    };

    const getTotalPercentage = () => {
        return milestones && milestones.reduce((sum, milestone) => sum + milestone.percentage, 0);
    };

    const totalPercentage = getTotalPercentage() || 0;

    return {
        handlePercentageChangeWrapper,
        totalPercentage,
        campaign,
        setCampaign,
        milestones,
    };
};


export default useRoadmap