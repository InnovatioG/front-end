import { ICampaignDetails } from '@/hooks/useCampaingDetails';
import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import React from 'react';
import EmptyState from '../EmpyState/EmptyState';
import styles from './CampaignTokenomicsTab.module.scss';
import { formatMoneyByADAOrDollar } from '@/store/generalStore/useGeneralStore';

const CampaignTokenomicsTab: React.FC<ICampaignIdStoreSafe & ICampaignDetails> = (props) => {
    const { campaign } = props;
    const { requestedMaxADA, campaignToken_CS, campaignToken_TN, campaignToken_PriceADA, tokenomics_max_supply, tokenomics_description } = campaign.campaign;

    if (tokenomics_description === '') {
        return <EmptyState {...props} />;
    }

    return (
        <div className={styles.layout}>
            <div className={styles.headerContainer}>
                <div className={styles.container}>
                    <label htmlFor="">Token Tick Name</label>
                    <span className={styles.strong}>{campaignToken_TN}</span>
                </div>
                <div className={styles.container}>
                    <label htmlFor="">Quantity</label>
                    <span className={styles.strong}>{tokenomics_max_supply}</span>
                </div>
                <div className={styles.container}>
                    <label htmlFor="">Value per Token</label>
                    <span className={styles.strong}>{formatMoneyByADAOrDollar(campaignToken_PriceADA)}</span>
                </div>
            </div>
            <div dangerouslySetInnerHTML={tokenomics_description ? { __html: tokenomics_description } : undefined} />
        </div>
    );
};

export default CampaignTokenomicsTab;
