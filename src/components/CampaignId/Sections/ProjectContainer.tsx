import React from 'react';
import QA from '@/components/CampaignId/Sections/QA';
import RoadMap from "@/components/CampaignId/Sections/RoadMap";
import ResumeOfTheTeam from "@/components/CampaignId/Sections/ResumeOfTheTeam";
import ProjectDetail from "@/components/CampaignId/Sections/ProjectDetail";
import Tokenomics from "@/components/CampaignId/Sections/Tokenomics";
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
import NavBarProjectEdition from '@/components/CampaignCreation/Elements/NavMenuProjectEdition';
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