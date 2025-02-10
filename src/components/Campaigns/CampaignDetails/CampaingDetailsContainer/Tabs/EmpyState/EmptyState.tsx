import Link from 'next/link';
import React from 'react';
import styles from './EmptyState.module.scss';
import { ICampaignDetails } from '@/hooks/useCampaingDetails';
import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import GeneralButtonUI from '@/components/General/Buttons/UI/Button';

const EmptyState: React.FC<ICampaignIdStoreSafe & ICampaignDetails> = (props: ICampaignIdStoreSafe & ICampaignDetails) => {
    const { campaign } = props;
    return (
        <article className={styles.emptyStateContainer}>
            <h2 className={styles.emptyStateText}>No content available</h2>
            <div className={styles.buttonContainer}>
                <Link href={`edit?id=${campaign.campaign._DB_id}`}>
                    <GeneralButtonUI onClick={() => { }} classNameStyle="outlineb">
                        <div className={styles.scontainer}>
                            Start editing your content!
                        </div>
                    </GeneralButtonUI>
                </Link>
            </div>
        </article>
    );
};

export default EmptyState;
