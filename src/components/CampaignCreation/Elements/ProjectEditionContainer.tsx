import ProjectDetail from '@/components/CampaignCreation/Elements/ProjectDetail';
import QYA from '@/components/CampaignCreation/Elements/Qa';
import ResumeOfTheTeam from '@/components/CampaignCreation/Elements/ResumeOfTheTeam';
import RoadMap from '@/components/CampaignCreation/Elements/Roadmap';
import Tokenomics from '@/components/CampaignCreation/Elements/Tokenomics';
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
import React from 'react';
import NavBarProjectEdition from './NavMenuProjectEdition';
import styles from './ProjectEditionContainer.module.scss';

interface ProjectEditionContainerProps {
    // Define props here
}

const ProjectEditionContainer: React.FC<ProjectEditionContainerProps> = (props) => {
    const { menuView } = useProjectDetailStore();

    const menuComponents: { [key: string]: React.ReactNode } = {
        'Project Detail': <ProjectDetail />,
        'Q&A': <QYA />,
        'Resume of the team': <ResumeOfTheTeam />,
        'Roadmap & Milestones': <RoadMap />,
        Tokenomics: <Tokenomics />,
    };

    return (
        <section className={styles.generalContainer}>
            <NavBarProjectEdition />
            {menuComponents[menuView] || <ProjectDetail />}
        </section>
    );
};

export default ProjectEditionContainer;
