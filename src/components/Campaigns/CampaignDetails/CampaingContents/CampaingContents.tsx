import { ICampaignDetails } from '@/hooks/useCampaingDetails';
import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import { CampaignTabEnum } from '@/utils/constants/routes';
import React from 'react';
import CampaignNavMenu from './CampaignNavMenu/CampaignNavMenu';
import styles from './CampaingContents.module.scss';
import CampaignDetailsTab from './Tabs/CampaignDetailsTab/CampaignDetailsTab';
import CampaignMembersTab from './Tabs/CampaignMembersTab/CampaignMembersTab';
import CampaignMilestonesTab from './Tabs/CampaignMilestonesTab/CampaignMilestonesTab';
import CampaignFaqsTab from '@/components/Campaigns/CampaignDetails/CampaingContents/Tabs/CampaignFaqsTab/CampaignFaqsTab';
import CampaignTokenomicsTab from './Tabs/CampaignTokenomicsTab/CampaignTokenomicsTab';

const CampaingContents: React.FC<ICampaignIdStoreSafe & ICampaignDetails> = (props: ICampaignIdStoreSafe & ICampaignDetails) => {
    const { campaignTab, campaign } = props;

    const menuComponents: Record<CampaignTabEnum, React.ReactNode> = {
        [CampaignTabEnum.DETAILS]: <CampaignDetailsTab {...props} />,
        [CampaignTabEnum.FAQS]: <CampaignFaqsTab {...props} />,
        [CampaignTabEnum.MEMBERS]: <CampaignMembersTab {...props} />,
        [CampaignTabEnum.ROADMAP]: <CampaignMilestonesTab {...props} />,
        [CampaignTabEnum.TOKENOMICS]: <CampaignTokenomicsTab {...props} />,
    };

    return (
        <>
            <section className={styles.generalContainer}>
                <p className={styles.description}>{campaign.campaign.description}</p>
            </section>

            <section className={styles.generalContainer} id={'nav-project'}>
                <CampaignNavMenu {...props} />
                {campaignTab !== undefined && menuComponents[campaignTab] !== undefined ? menuComponents[campaignTab] : <CampaignDetailsTab {...props} />}
            </section>
        </>
    );
};

export default CampaingContents;
