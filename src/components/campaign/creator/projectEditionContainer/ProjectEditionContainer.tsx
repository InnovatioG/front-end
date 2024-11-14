import React from 'react';
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
import NavBarProjectEdition from './NavMenuProjectEdition';
import styles from "./ProjectEditionContainer.module.scss";
import ProjectDetail from "@/components/campaign/creator/projectEditionContainer/ProjectDetail";
import QYA from "@/components/campaign/creator/projectEditionContainer/Qa";
import ResumeOfTheTeam from "@/components/campaign/creator/projectEditionContainer/ResumeOfTheTeam";
import RoadMap from "@/components/campaign/creator/projectEditionContainer/Roadmap";
import Tokenomics from "@/components/campaign/creator/projectEditionContainer/Tokenomics";

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