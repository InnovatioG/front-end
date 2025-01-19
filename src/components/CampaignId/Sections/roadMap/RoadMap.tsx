import EmptyState from '@/components/CampaignId/Sections/empyState/EmptyState';
import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';
import React, { useEffect } from 'react';
import RoadMapCard from './RoadMapCard';

interface RoadMapProps {
    // Define props here
}

const RoadMap: React.FC<RoadMapProps> = (props) => {
    const { campaign } = useCampaignIdStore();
    const { milestones } = campaign;


    if (milestones && milestones.length === 0) {
        return <EmptyState />;
    }

    return (
        <article>
            <div id="roadmap">
                {milestones && milestones.map((milestone) => (
                    <RoadMapCard key={milestone._DB_id} milestone={milestone} index={milestones.indexOf(milestone)} goal={Number(campaign.requestMaxAda)} />
                ))}
            </div>
        </article>
    );
};

export default RoadMap;
