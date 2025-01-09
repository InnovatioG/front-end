import type { MilestoneF, Project } from '@/HardCode/databaseType';

export const calculateTotalOtherPercentages = (milestones: MilestoneF[], milestone_id: number): number => {
    return milestones.filter((milestone) => milestone.id !== milestone_id).reduce((sum, milestone) => sum + milestone.percentage, 0);
};

export const handlePercentageChange = (milestone_id: number, newPercentage: number, milestones: MilestoneF[], setProject: any, project: Project): boolean => {
    const totalOtherPercentages = calculateTotalOtherPercentages(milestones, milestone_id);

    if (totalOtherPercentages + newPercentage > 100) {
        return false;
    }

    const updatedMilestones = milestones.map((milestone) => (milestone.id === milestone_id ? { ...milestone, percentage: newPercentage } : milestone));

    setProject({
        ...project,
        milestones: updatedMilestones,
    });

    return true;
};
