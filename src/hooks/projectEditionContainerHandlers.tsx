import type { Milestone } from '@/types/types';
import type { Campaign } from '@/types/types';

export const calculateTotalOtherPercentages = (milestones: Milestone[], milestone_id: string): number => {
    return milestones.filter((milestone) => milestone._DB_id !== milestone_id).reduce((sum, milestone) => sum + milestone.percentage, 0);
};

export const handlePercentageChange = (milestone_id: string, newPercentage: number, milestones: Milestone[], setCampaign: any, campaign: Campaign): boolean => {
    const totalOtherPercentages = calculateTotalOtherPercentages(milestones, milestone_id);

    if (totalOtherPercentages + newPercentage > 100) {
        return false;
    }

    const updatedMilestones = milestones.map((milestone) => (milestone._DB_id === milestone_id ? { ...milestone, percentage: newPercentage } : milestone));

    setCampaign({
        ...campaign,
        milestones: updatedMilestones,
    });

    return true;
};
