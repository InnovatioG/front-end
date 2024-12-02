import React from 'react';
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
import MilestoneCardEdit from './MilestoneEdit';
import { handlePercentageChange } from '@/handlers/projectEditionContainer/projectEditionContainerHandlers';
import type { MilestoneF } from "@/HardCode/databaseType";

interface RoadMapYMilestonesProps {
    // Define props here
}

const RoadMapYMilestones: React.FC<RoadMapYMilestonesProps> = (props) => {
    const { project, setProject } = useProjectDetailStore();

    const milestones = project.milestones;

    const handlePercentageChangeWrapper = (milestoneId: number, newPercentage: number) => {
        return handlePercentageChange(milestoneId, newPercentage, milestones, setProject, project);
    };

    const getTotalPercentage = () => {
        return milestones.reduce((sum, milestone) => sum + milestone.cmPercentage, 0);
    };

    const totalPercentage = getTotalPercentage();

    return (
        <div className={totalPercentage > 100 ? 'over-limit' : ''}>
            {milestones.map((milestone, index) => (
                <div key={milestone.id}>
                    <MilestoneCardEdit
                        milestone={milestone}
                        index={index}
                        maxAvailablePercentage={100 - totalPercentage + milestone.cmPercentage}
                        onPercentageChange={(newPercentage) => handlePercentageChangeWrapper(milestone.id, newPercentage)}
                    />
                </div>
            ))}
        </div>
    );
}

export default RoadMapYMilestones;

/* [
    {
        "id": 1,
        "campaign_id": 2,
        "campaign_status_id": 1,
        "cmPercentage": 40,
        "status": "Not Started",
        "cmEstimatedDeliveryDate": "5 weeks",
        "milestone_status": {
            "id": 1,
            "name": "Bit",
            "description": "<p>The first milestone corresponds to the official launch of the product development. Therefore, this first Milestone aims to achieve the development of the mock-up and the integration of the smart contracts.</p><p><br></p><p>Deliverables: </p><ol><li>Figma Mockup in react, 100% functional in the UI with minimal complications with the backend </li><li>Comprehensive document outlining the tech, frameworks, and architectures used for MVP development. </li><li>Payment to all team members, fulfilling all salaries. </li></ol>",
            "created_at": "",
            "updated_at": ""
        }
    },
    {
        "id": 2,
        "campaign_id": 2,
        "campaign_status_id": 1,
        "cmPercentage": 30,
        "status": "Not Started",
        "cmEstimatedDeliveryDate": "3 weeks",
        "milestone_status": {
            "id": 2,
            "name": "in_progress",
            "description": "<p>The second milestone is focused on completing the infrastructure and integration of the smart contracts and all backend of the application in general.</p><p><br></p><ol><li>Application architectures and its backend.</li><li>Operation and relationship of the smart contracts</li><li>Testing video demonstrating the functionality of the backend and the main smart contracts.</li></ol>",
            "created_at": "",
            "updated_at": ""
        }
    },
    {
        "id": 3,
        "campaign_id": 2,
        "campaign_status_id": 1,
        "cmPercentage": 30,
        "status": "Not Started",
        "cmEstimatedDeliveryDate": "3 weeks",
        "milestone_status": {
            "id": 3,
            "name": "completed",
            "description": "<p>The third and final milestone correspond to launching the functional application into pre-production and condcting a demostration of the entire UX, smart contracts and backend operations.</p><p><br></p><p><br></p><ol><li>Testing video demonstrating the functionality of the backend and the main smart contracts.</li><li>App archi</li></ol>",
            "created_at": "",
            "updated_at": ""
        }
    }
] */