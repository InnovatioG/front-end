import type { Milestone } from '@/types/types';
interface getRemainingPercentageF {
    (currentmilestone_id: number, milestones: Milestone[]): number;
}

export const getRemainingPercentage: getRemainingPercentageF = (currentmilestone_id, milestones) => {
    const totalUsed = milestones.filter((milestone) => Number(milestone._Db_id) !== currentmilestone_id).reduce((sum, milestone) => sum + milestone.percentage, 0);
    return 100 - totalUsed;
};
