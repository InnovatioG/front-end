import EmptyState from '@/components/CampaignId/Sections/empyState/EmptyState';
import LoadingPage from '@/components/LoadingPage/LoadingPage';
import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';
import React, { useEffect } from 'react';
import styles from './Tokenomics.module.scss';
import { useGeneralStore } from '@/store/generalConstants/useGeneralConstants';
interface TokenomicsProps {
    // Define props here
}

const Tokenomics: React.FC<TokenomicsProps> = (props) => {
    const { campaign, isLoadingPrice } = useCampaignIdStore();
    const { requestMaxAda, campaignToken_CS, campaignToken_tn, campaignToken_priceADA, tokenomics_max_supply, tokenomics_description } = campaign
    const { adaPrice } = useGeneralStore();


    if (isLoadingPrice) {
        return <LoadingPage />;
    }

    if (campaign.tokenomics_description === '') {
        return <EmptyState />;
    }

    return (
        <div className={styles.layout}>
            <div className={styles.headerContainer}>
                <div className={styles.container}>
                    <label htmlFor="">Token Tick Name</label>
                    <span className={styles.strong}>{campaignToken_tn}</span>
                </div>
                <div className={styles.container}>
                    <label htmlFor="">Quantity</label>
                    <span className={styles.strong}>{(tokenomics_max_supply)}</span>
                </div>
                <div className={styles.container}>
                    <label htmlFor="">Value per Token</label>
                    <span className={styles.strong}>{Number(campaignToken_priceADA)}</span>
                </div>
            </div>
            <div dangerouslySetInnerHTML={tokenomics_description ? { __html: tokenomics_description } : undefined} />
        </div>
    );
};

export default Tokenomics;
