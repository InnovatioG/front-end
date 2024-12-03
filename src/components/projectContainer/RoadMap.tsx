import React from 'react';
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
import RoadMapCard from './RoadMapCard';



interface RoadMapProps {
    // Define props here
}

const RoadMap: React.FC<RoadMapProps> = (props) => {

    const { project } = useProjectDetailStore();
    const milestones = project.milestones;
    console.log(milestones)

    return (
        <article>
            <div id='roadmap'>
                {milestones.map((milestone) => (
                    <RoadMapCard
                        key={milestone.id}
                        milestone={milestone}
                        index={milestones.indexOf(milestone)}
                        goal={project.goal}
                    />
                ))}
            </div>

        </article>
    );
}

export default RoadMap;