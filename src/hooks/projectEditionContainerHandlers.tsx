import type { Project } from '@/HardCode/databaseType';
import type { Milestone } from '@/types/types';

export const calculateTotalOtherPercentages = (milestones: Milestone[], milestone_id: number): number => {
    return milestones.filter((milestone) => milestone._Db_id !== milestone_id).reduce((sum, milestone) => sum + milestone.percentage, 0);
};

export const handlePercentageChange = (milestone_id: number, newPercentage: number, milestones: Milestone[], setProject: any, project: Project): boolean => {
    const totalOtherPercentages = calculateTotalOtherPercentages(milestones, milestone_id);

    if (totalOtherPercentages + newPercentage > 100) {
        return false;
    }

    const updatedMilestones = milestones.map((milestone) => (milestone._Db_id === milestone_id ? { ...milestone, percentage: newPercentage } : milestone));

    setProject({
        ...project,
        milestones: updatedMilestones,
    });

    return true;
};
