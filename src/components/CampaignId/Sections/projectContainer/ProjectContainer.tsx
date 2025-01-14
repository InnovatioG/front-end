import NavBarProjectEdition from '@/components/CampaignCreation/Elements/NavMenuProjectEdition';
import ProjectDetail from '@/components/CampaignId/Sections/projectDetail/ProjectDetail';
import QA from '@/components/CampaignId/Sections/QA/QA';
import ResumeOfTheTeam from '@/components/CampaignId/Sections/resumeOfTheTeam/ResumeOfTheTeam';
import RoadMap from '@/components/CampaignId/Sections/roadMap/RoadMap';
import Tokenomics from '@/components/CampaignId/Sections/tokenomics/Tokenomics';
import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';
import React from 'react';
import styles from './ProjectContainer.module.scss';
interface ProjectContainerProps { }

const ProjectContainer: React.FC<ProjectContainerProps> = (props) => {
    const { menuView, setEditionMode } = useCampaignIdStore();

    const menuComponents: { [key: string]: React.ReactNode } = {
        'Project Detail': <ProjectDetail />,
        'Q&A': <QA />,
        'Resume of the team': <ResumeOfTheTeam />,
        'Roadmap & Milestones': <RoadMap />,
        Tokenomics: <Tokenomics />,
    };

    return (
        <section className={styles.generalContainer} id={'nav-project'}>
            <NavBarProjectEdition />
            {menuComponents[menuView] || <ProjectDetail />}
        </section>
    );
};

export default ProjectContainer;
