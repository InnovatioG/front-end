import type { MilestoneF, Project } from "@/HardCode/databaseType";

export const calculateTotalOtherPercentages = (milestones: MilestoneF[], milestoneId: number): number => {
    return milestones
        .filter(milestone => milestone.id !== milestoneId)
        .reduce((sum, milestone) => sum + milestone.percentage, 0);
};

export const handlePercentageChange = (
    milestoneId: number,
    newPercentage: number,
    milestones: MilestoneF[],
    setProject: any,
    project: Project
): boolean => {
    const totalOtherPercentages = calculateTotalOtherPercentages(milestones, milestoneId);

    if (totalOtherPercentages + newPercentage > 100) {
        return false;
    }

    const updatedMilestones = milestones.map(milestone =>
        milestone.id === milestoneId ? { ...milestone, percentage: newPercentage } : milestone
    );

    setProject({
        ...project,
        milestones: updatedMilestones
    });

    return true;
};