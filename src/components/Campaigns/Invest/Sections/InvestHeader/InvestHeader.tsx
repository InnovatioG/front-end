import { AvatarDisplay, AvatarFallback, AvatarImage } from '@/components/GeneralOK/Avatar/AvatarDisplay/AvatarDisplay';
import { useCampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import React from 'react';
import styles from './InvestHeader.module.scss';

const InvestHeader: React.FC = () => {
    const { campaign, isLoading, setIsLoading, setIsEditMode, fetchCampaignById, setCampaignTab } = useCampaignIdStoreSafe();
    return (
        <div className={styles.layout}>
            <h1>Invest</h1>
            <div className={styles.textInfo}>
                <h2>{campaign?.campaign.name}</h2>
                <div className={styles.imagenContainer}>
                    <AvatarDisplay big={false} className={styles.pictureContainer}>
                        <AvatarImage src={campaign.campaign.logo_url} alt={campaign.campaign.name} />
                        <AvatarFallback>{campaign.campaign.name.slice(0, 2)}</AvatarFallback>
                    </AvatarDisplay>
                </div>
            </div>
        </div>
    );
};

export default InvestHeader;
