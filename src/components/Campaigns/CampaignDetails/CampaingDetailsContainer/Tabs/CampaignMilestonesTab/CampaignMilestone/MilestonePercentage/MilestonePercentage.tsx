import { ICampaignDetails } from '@/hooks/useCampaingDetails';
import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import React from 'react';
import styles from './MilestonePercentage.module.scss';
import useMilestonePercentage, { MilestonePercentageProps } from './useMilestonePercentage';

const MilestonePercentage: React.FC<MilestonePercentageProps & ICampaignIdStoreSafe & ICampaignDetails> = (props) => {
    const { editionMode } = props;
    const { percentage, handlePercentageChange, formattedGoal } = useMilestonePercentage(props);

    return (
        <div className={styles.container}>
            <span className={styles.funds}>Funds</span>

            {editionMode ? (
                <input
                    type="text"
                    pattern="\d*"
                    inputMode="numeric"
                    min="0"
                    max="100"
                    className={styles.percentageTotal}
                    onChange={handlePercentageChange}
                    value={percentage ? `${percentage}%` : ''}
                />
            ) : (
                <span className={styles.percentageTotalSpan}>{percentage ? `${percentage}%` : ''}</span>
            )}

            <span className={styles.percentage}>{formattedGoal}</span>
        </div>
    );
};

export default MilestonePercentage;
