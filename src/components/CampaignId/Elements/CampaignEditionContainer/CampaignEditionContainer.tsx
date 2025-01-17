import CampaignDetail from '@/components/CampaignId/Elements/CampaignDetail/CampaignDetail';
import QYA from '@/components/CampaignDashboard/Sections/QA/Qa';
import ResumeOfTheTeam from '@/components/CampaignCreation/Elements/ResumeOfTheTeam/ResumeOfTheTeam';
import RoadMap from '@/components/CampaignDashboard/Sections/Roadmap/Roadmap';
import Tokenomics from '@/components/CampaignCreation/Elements/Tokenomics/Tokenomics';
import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';
import React from 'react';
import NavBarProjectEdition from '@/components/CampaignId/Elements/NavMenuProjectEdition/NavMenuProjectEdition';
import styles from "./CampaignEditionContainer.module.scss"



const CampaignEditionContainer: React.FC = (props) => {
    const { menuView } = useCampaignIdStore();

    const menuComponents: { [key: string]: React.ReactNode } = {
        'Campaign Detail': <CampaignDetail />,
        'Q&A': <QYA />,
        'Resume of the team': <ResumeOfTheTeam />,
        'Roadmap & Milestones': <RoadMap />,
        Tokenomics: <Tokenomics />,
    };

    return (
        <section className={styles.generalContainer}>
            <NavBarProjectEdition />
            {menuComponents[menuView] || <CampaignDetail />}
        </section>
    );
};

export default CampaignEditionContainer;
