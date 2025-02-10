import { ICampaignDetails } from '@/hooks/useCampaingDetails';
import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import { CampaignTab } from '@/utils/constants/routes';
import React from 'react';
import CampaignNavMenu from './CampaignNavMenu/CampaignNavMenu';
import styles from './CampaingDetailsContainer.module.scss';
import CampaignDetailsTab from './Tabs/CampaignDetailsTab/CampaignDetailsTab';
import CampaignMembersTab from './Tabs/CampaignMembersTab/CampaignMembersTab';
import CampaignMilestonesTab from './Tabs/CampaignMilestonesTab/CampaignMilestonesTab';
import CampaignQATab from './Tabs/CampaignQATab/CampaignQATab';
import CampaignTokenomicsTab from './Tabs/CampaignTokenomicsTab/CampaignTokenomicsTab';

const CampaingDetailsContainer: React.FC<ICampaignIdStoreSafe & ICampaignDetails> = (props: ICampaignIdStoreSafe & ICampaignDetails) => {
    const { menuView } = props;

    const menuComponents: Record<CampaignTab, React.ReactNode> = {
        [CampaignTab.DETAILS]: <CampaignDetailsTab {...props} />,
        [CampaignTab.QA]: <CampaignQATab {...props} />,
        [CampaignTab.MEMBERS]: <CampaignMembersTab {...props} />,
        [CampaignTab.ROADMAP]: <CampaignMilestonesTab {...props} />,
        [CampaignTab.TOKENOMICS]: <CampaignTokenomicsTab {...props} />,
    };

    return (
        <section className={styles.generalContainer} id={'nav-project'}>
            <CampaignNavMenu {...props} />
            {menuComponents[menuView] || <CampaignDetailsTab {...props} />}
        </section>
    );
};

export default CampaingDetailsContainer;
