import { handlePercentageChange } from '@/hooks/projectEditionContainerHandlers';
import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';
import React, { useEffect } from 'react';
import MilestoneCardEdit from './MilestoneEdit';
import styles from './Roadmap.module.scss';

interface RoadMapYMilestonesProps {
    // Define props here
}

const RoadMapYMilestones: React.FC<RoadMapYMilestonesProps> = (props) => {
    const { campaign, setCampaign } = useCampaignIdStore();

    const { milestones } = campaign;


    useEffect(() => {
    }, [])


    const handlePercentageChangeWrapper = (milestone_id: number, newPercentage: number) => {
        return handlePercentageChange(milestone_id, newPercentage, milestones, setProject, project);
    };

    const getTotalPercentage = () => {
        return milestones && milestones.reduce((sum, milestone) => sum + milestone.percentage, 0);
    };

    const totalPercentage = getTotalPercentage();




    return (
        <div className={styles.milestoneContainer}>
            {milestones && milestones.map((milestone, index) => (
                <div key={milestone._Db_id}>
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
};

export default RoadMapYMilestones;
