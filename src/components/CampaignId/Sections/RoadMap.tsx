import EmptyState from '@/components/CampaignId/Sections/EmptyState';
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
import React from 'react';
import RoadMapCard from './RoadMapCard';

interface RoadMapProps {
    // Define props here
}

const RoadMap: React.FC<RoadMapProps> = (props) => {
    const { project } = useProjectDetailStore();
    const milestones = project.milestones;
    if (milestones.every((milestone) => milestone.milestone_status && milestone.milestone_status.description === '')) {
        return <EmptyState />;
    }
    return (
        <article>
            <div id="roadmap">
                {milestones.map((milestone) => (
                    <RoadMapCard key={milestone.id} milestone={milestone} index={milestones.indexOf(milestone)} goal={project.goal} />
                ))}
            </div>
        </article>
    );
};

export default RoadMap;
