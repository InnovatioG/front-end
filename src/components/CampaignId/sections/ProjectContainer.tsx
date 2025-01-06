import React from 'react';
import QA from "@/components/projectContainer/QA";
import RoadMap from "@/components/projectContainer/RoadMap";
import ResumeOfTheTeam from "@/components/projectContainer/ResumeOfTheTeam";
import ProjectDetail from "@/components/projectContainer/ProjectDetail";
import Tokenomics from "@/components/projectContainer/Tokenomics";
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
import NavBarProjectEdition from '@/components/CampaignCreation/elements/NavMenuProjectEdition';
import styles from "./ProjectContainer.module.scss"
import { useEffect } from 'react';
interface ProjectContainerProps {
}

const ProjectContainer: React.FC<ProjectContainerProps> = (props) => {
    const { menuView, setEditionMode } = useProjectDetailStore();



    const menuComponents: { [key: string]: React.ReactNode } = {
        "Project Detail": <ProjectDetail />,
        "Q&A": <QA />,
        "Resume of the team": <ResumeOfTheTeam />,
        "Roadmap & Milestones": <RoadMap />,
        "Tokenomics": <Tokenomics />,
    };




    return (
        <section className={styles.generalContainer} id={"nav-project"}>
            <NavBarProjectEdition />
            {menuComponents[menuView] || <ProjectDetail />}
        </section>
    );
}

export default ProjectContainer;