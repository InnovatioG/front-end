import type { MilestoneF, Project } from "@/HardCode/databaseType";

export const calculateTotalOtherPercentages = (milestones: MilestoneF[], milestoneId: number): number => {
    return milestones
        .filter(milestone => milestone.id !== milestoneId)
        .reduce((sum, milestone) => sum + milestone.percentage, 0);
};

export const updateMilestonesPercentage = (
    milestones: MilestoneF[],
    milestoneId: number,
    newPercentage: number,
    totalOtherPercentages: number
): MilestoneF[] => {
    const updatedMilestones = milestones.map(milestone =>
        milestone.id === milestoneId ? { ...milestone, percentage: newPercentage } : milestone
    );

    const remainingPercentage = 100 - totalOtherPercentages - newPercentage;
    const lastMilestoneIndex = updatedMilestones.length - 1;
    updatedMilestones[lastMilestoneIndex] = {
        ...updatedMilestones[lastMilestoneIndex],
        percentage: remainingPercentage
    };

    return updatedMilestones;
};

export const handlePercentageChange = (
    milestoneId: number,
    newPercentage: number,
    milestones: MilestoneF[],
    setProject: React.Dispatch<React.SetStateAction<Project>>,
    project: Project
): boolean => {
    const totalOtherPercentages = calculateTotalOtherPercentages(milestones, milestoneId);

    if (totalOtherPercentages + newPercentage > 100) {
        return false;
    }

    const updatedMilestones = updateMilestonesPercentage(milestones, milestoneId, newPercentage, totalOtherPercentages);

    setProject({
        ...project,
        milestones: updatedMilestones
    });

    return true;
};