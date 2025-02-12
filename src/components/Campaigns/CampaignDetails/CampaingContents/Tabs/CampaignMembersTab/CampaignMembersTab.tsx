import styles from './CampaignMembersTab.module.scss';
import { ICampaignDetails } from '@/hooks/useCampaingDetails';
import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import React from 'react';
import CampaignMembersTabAccordion from './CampaignMembersTabAccordion/CampaignMembersTabAccordion';

const CampaignMembersTab: React.FC<ICampaignIdStoreSafe & ICampaignDetails> = (props) => {
    return (
        <section className={styles.layout}>
            <span className={styles.title}>Active Members</span>
            <CampaignMembersTabAccordion {...props} />
        </section>
    );
};

export default CampaignMembersTab;
