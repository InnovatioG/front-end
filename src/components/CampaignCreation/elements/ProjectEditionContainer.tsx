import React from 'react';
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
import NavBarProjectEdition from './NavMenuProjectEdition';
import styles from "./ProjectEditionContainer.module.scss";
import ProjectDetail from "@/components/CampaignCreation/elements/ProjectDetail";
import QYA from "@/components/CampaignCreation/elements/Qa";
import ResumeOfTheTeam from "@/components/CampaignCreation/elements/ResumeOfTheTeam";
import RoadMap from "@/components/CampaignCreation/elements/Roadmap";
import Tokenomics from "@/components/CampaignCreation/elements/Tokenomics";

interface ProjectEditionContainerProps {
    // Define props here
}

const ProjectEditionContainer: React.FC<ProjectEditionContainerProps> = (props) => {
    const { menuView } = useProjectDetailStore();

    const menuComponents: { [key: string]: React.ReactNode } = {
        "Project Detail": <ProjectDetail />,
        "Q&A": <QYA />,
        "Resume of the team": <ResumeOfTheTeam />,
        "Roadmap & Milestones": <RoadMap />,
        "Tokenomics": <Tokenomics />,
    };

    return (
        <section className={styles.generalContainer}>
            <NavBarProjectEdition />
            {menuComponents[menuView] || <ProjectDetail />}
        </section>
    );
}

export default ProjectEditionContainer;