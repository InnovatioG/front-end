import CampaignDetail from '@/components/CampaignId/Elements/CampaignDetail/CampaignDetail';
import QYA from '@/components/CampaignCreation/Elements/Qa';
import ResumeOfTheTeam from '@/components/CampaignCreation/Elements/ResumeOfTheTeam';
import RoadMap from '@/components/CampaignCreation/Elements/Roadmap';
import Tokenomics from '@/components/CampaignCreation/Elements/Tokenomics';
import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';
import React from 'react';
import NavBarProjectEdition from '@/components/CampaignId/Elements/NavMenuProjectEdition/NavMenuProjectEdition';
import styles from "@/components/CampaignCreation/Elements/CampaignEditionContainer.module.scss"



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
