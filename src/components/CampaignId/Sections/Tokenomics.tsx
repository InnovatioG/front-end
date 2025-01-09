import EmptyState from '@/components/CampaignId/Sections/EmptyState';
import LoadingPage from '@/components/LoadingPage/LoadingPage';
import { useProjectDetailStore } from '@/store/projectdetail/useCampaignIdStore';
import React, { useEffect } from 'react';
import styles from './Tokenomics.module.scss';
interface TokenomicsProps {
    // Define props here
}

const Tokenomics: React.FC<TokenomicsProps> = (props) => {
    const { project, fetchAdaPrice, price_ada, isLoadingPrice } = useProjectDetailStore();
    const goal = project.goal;
    const cdRequestedMaxADA = project.cdRequestedMaxADA;

    useEffect(() => {
        fetchAdaPrice();
    }, [fetchAdaPrice]);

    const valuePerToken =
        project.cdRequestedMaxADA === null || isNaN(project.cdRequestedMaxADA) || project.goal === null || isNaN(project.goal) || project.goal === 0 ? (
            'Price per token'
        ) : (
            <div className={styles.priceInAda}>
                <img src={'/img/icons/ADA.svg'} alt="ADA" height={40} width={40} />
                <span className={styles.strong}>{(project.goal / project.cdRequestedMaxADA / price_ada).toFixed(2)}</span>
            </div>
        );

    if (isLoadingPrice) {
        return <LoadingPage />;
    }

    if (project.tokenomics_description === '') {
        return <EmptyState />;
    }

    return (
        <div className={styles.layout}>
            <div className={styles.headerContainer}>
                <div className={styles.container}>
                    <label htmlFor="">Token Tick Name</label>
                    <span className={styles.strong}>{project.cdCampaignToken_TN}</span>
                </div>
                <div className={styles.container}>
                    <label htmlFor="">Quantity</label>
                    <span className={styles.strong}>{cdRequestedMaxADA}</span>
                </div>
                <div className={styles.container}>
                    <label htmlFor="">Value per Token</label>
                    <span className={styles.strong}>{valuePerToken}</span>
                </div>
            </div>
            <div dangerouslySetInnerHTML={{ __html: project.tokenomics_description }} />
        </div>
    );
};

export default Tokenomics;
