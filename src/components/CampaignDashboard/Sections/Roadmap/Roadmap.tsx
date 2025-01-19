
import React from 'react';
import MilestoneCardEdit from '../../../CampaignCreation/Elements/MilestoneEdit/MilestoneEdit';
import styles from "@/components/CampaignDashboard/Sections/Roadmap/Roadmap.module.scss"
import useRoadmap from '@/components/CampaignDashboard/Sections/Roadmap/useRoadmap';

const RoadMapYMilestones: React.FC = (props) => {
    const { handlePercentageChangeWrapper, totalPercentage, milestones } = useRoadmap();

    return (
        <div className={styles.milestoneContainer}>
            {milestones &&
                milestones.map((milestone, index) => (
                    <div key={milestone._DB_id}>
                        <MilestoneCardEdit
                            milestone={milestone}
                            index={index}
                            maxAvailablePercentage={100 - totalPercentage + milestone.percentage}
                            onPercentageChange={(newPercentage) => handlePercentageChangeWrapper(milestone._DB_id, newPercentage)}
                        />
                    </div>
                ))}
        </div>
    );
};

export default RoadMapYMilestones;
