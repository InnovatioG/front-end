import { ICampaignDetails } from '@/hooks/useCampaingDetails';
import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import React from 'react';
import EmptyState from '../EmpyState/EmptyState';
import CampaignRoadmapMilestone from './CampaignMilestone/CampaignMilestone';

const CampaignMilestonesTab: React.FC<ICampaignIdStoreSafe & ICampaignDetails> = (props) => {
    const { campaign } = props;
    const { milestones } = campaign;

    if (milestones && milestones.length === 0) {
        return <EmptyState {...props} />;
    }
    return (
        <article>
            <div id="roadmap">
                {milestones &&
                    milestones.map((milestone) => (
                        <CampaignRoadmapMilestone
                            key={milestone.milestone._DB_id}
                            milestone={milestone}
                            index={milestones.indexOf(milestone)}
                            {...props}
                        />
                    ))}
            </div>
        </article>
    );
};

export default CampaignMilestonesTab;
