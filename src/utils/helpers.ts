import type { MilestoneF } from '@/HardCode/databaseType';

interface getRemainingPercentageF {
    (currentmilestone_id: number, milestones: MilestoneF[]): number;
}

export const getRemainingPercentage: getRemainingPercentageF = (currentmilestone_id, milestones) => {
    const totalUsed = milestones.filter((milestone) => milestone.id !== currentmilestone_id).reduce((sum, milestone) => sum + milestone.percentage, 0);
    return 100 - totalUsed;
};
