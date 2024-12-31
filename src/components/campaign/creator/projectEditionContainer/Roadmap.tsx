import React from 'react';
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
import MilestoneCardEdit from './MilestoneEdit';
import { handlePercentageChange } from '@/handlers/projectEditionContainer/projectEditionContainerHandlers';
import type { MilestoneF } from "@/HardCode/databaseType";
import EmptyState from '@/components/emptyStates/EmptyState';
import styles from "./Roadmap.module.scss"


interface RoadMapYMilestonesProps {
    // Define props here
}

const RoadMapYMilestones: React.FC<RoadMapYMilestonesProps> = (props) => {
    const { project, setProject } = useProjectDetailStore();

    const { milestones } = project;




    const handlePercentageChangeWrapper = (milestoneId: number, newPercentage: number) => {
        return handlePercentageChange(milestoneId, newPercentage, milestones, setProject, project);
    };

    const getTotalPercentage = () => {
        return milestones.reduce((sum, milestone) => sum + milestone.percentage, 0);
    };

    const totalPercentage = getTotalPercentage();






    return (
        <div className={styles.milestoneContainer} >
            {milestones.map((milestone, index) => (
                <div key={milestone.id}>
                    <MilestoneCardEdit
                        milestone={milestone}
                        index={index}
                        maxAvailablePercentage={100 - totalPercentage + milestone.percentage}
                        onPercentageChange={(newPercentage) => handlePercentageChangeWrapper(milestone.id, newPercentage)}
                    />
                </div>
            ))}
        </div>
    );
}

export default RoadMapYMilestones;
