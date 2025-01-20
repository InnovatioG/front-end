import GeneralButtonUI from '@/components/UI/Buttons/UI/Button';
import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';
import Link from 'next/link';
import React from 'react';
import styles from './EmptyState.module.scss';
interface EmptyStateProps {
    // Define props here
}

const EmptyState: React.FC<EmptyStateProps> = (props) => {
    const { campaign, setMenuView } = useCampaignIdStore();
    return (
        <article className={styles.emptyStateContainer}>
            <h2 className={styles.emptyStateText}>No content available</h2>
            <div className={styles.buttonContainer}>
                <Link href={`edit?id=${campaign._DB_id}`}>
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
