import React from 'react';
import QA from '@/components/CampaignId/sections/QA';
import RoadMap from "@/components/CampaignId/sections/RoadMap";
import ResumeOfTheTeam from "@/components/CampaignId/sections/ResumeOfTheTeam";
import ProjectDetail from "@/components/CampaignId/sections/ProjectDetail";
import Tokenomics from "@/components/CampaignId/sections/Tokenomics";
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
import NavBarProjectEdition from '@/components/CampaignCreation/elements/NavMenuProjectEdition';
import styles from "./ProjectContainer.module.scss"
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