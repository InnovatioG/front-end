import Link from 'next/link';
import React from 'react';
import styles from './EmptyState.module.scss';
import { ICampaignDetails } from '@/hooks/useCampaingDetails';
import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import BtnGeneral from '@/components/GeneralOK/Buttons/BtnGeneral/BtnGeneral';
import { ROUTES } from '@/utils/constants/routes';

const EmptyState: React.FC<ICampaignIdStoreSafe & ICampaignDetails> = (props: ICampaignIdStoreSafe & ICampaignDetails) => {
    const { campaign, pageView, campaignTab, isEditMode } = props;
    return (
        <article className={styles.emptyStateContainer}>
            <h2 className={styles.emptyStateText}>No content available</h2>
            <div className={styles.buttonContainer}>
                <Link href={ROUTES.campaignDynamicTab(campaign.campaign._DB_id, campaignTab, pageView, true)}>
                    <BtnGeneral onClick={() => {}} classNameStyle="outlineb">
                        <div className={styles.scontainer}>Start editing your content!</div>
                    </BtnGeneral>
                </Link>
            </div>
        </article>
    );
};

export default EmptyState;
