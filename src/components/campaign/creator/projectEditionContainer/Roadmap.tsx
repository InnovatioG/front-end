import React from 'react';
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
import MilestoneCardEdit from './MilestoneEdit';
interface RoadMapYMilestonesProps {
    // Define props here
}







const RoadMapYMilestones: React.FC<RoadMapYMilestonesProps> = (props) => {

    const { project, setProject } = useProjectDetailStore();
    const milestones = project.milestones;



    const handlePercentageChange = (milestoneId: number, newPercentage: number) => {
        const otherMilestones = milestones.filter(milestone => milestone.id !== milestoneId);
        const totalOtherPercentages = otherMilestones.reduce((sum, milestone) => sum + milestone.percentage, 0);

        //check if new percentage would exceed 100% 
        if (totalOtherPercentages + newPercentage > 100) {
            return false;
        }

        const updateMilestones = milestones.map(milestone =>
            milestone.id === milestoneId ? { ...milestone, percentage: newPercentage } : milestone
        )

        setProject({
            ...project,
            milestones: updateMilestones
        });

        return true;

    }


    const getRemainingPercentage = (currentMilestoneId: number) => {
        const totalUsed = milestones.filter(milestone => milestone.id !== currentMilestoneId).reduce((sum, milestone) => sum + milestone.percentage, 0);
        return 100 - totalUsed;
    }



    return (
        <div>
            {
                milestones.map((milestone, index) => {
                    return (
                        <div key={milestone.id}>
                            <MilestoneCardEdit milestone={milestone}
                                index={index}
                                maxAvailablePercentage={getRemainingPercentage(milestone.id)}
                                onPercentageChange={(newPercentage) =>
                                    handlePercentageChange(milestone.id, newPercentage)
                                }
                            />
                        </div>
                    )
                })
            }
        </div>
    );
}

export default RoadMapYMilestones;