import type { MilestoneF } from "@/HardCode/databaseType";

interface getRemainingPercentageF {
  (currentMilestoneId: number, milestones: MilestoneF[]): number;
}

export const getRemainingPercentage: getRemainingPercentageF = (
  currentMilestoneId,
  milestones
) => {
  const totalUsed = milestones
    .filter((milestone) => milestone.id !== currentMilestoneId)
    .reduce((sum, milestone) => sum + milestone.percentage, 0);
  return 100 - totalUsed;
};
