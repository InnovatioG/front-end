import { formatMoneyByADAOrDollar } from '@/store/generalStore/useGeneralStore';
import { CampaignEX, MilestoneEX } from '@/types/types';
import React from 'react';
import styles from './MilestonePercentage.module.scss';

interface MilestonePercentageProps {
    campaign: CampaignEX;
    milestone: MilestoneEX;
    onChange: (percentage: number) => void;
    isEditMode: boolean;
}

const MilestonePercentage: React.FC<MilestonePercentageProps> = (props) => {
    const { campaign, milestone, isEditMode, onChange } = props;

    const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
        if (value === '') {
            onChange(0); // Default to 0 if empty
        } else {
            const newValue = parseInt(value, 10);
            if (!isNaN(newValue)) {
                onChange(newValue);
            }
        }
    };

    const percentageGoal = (Number(campaign.campaign.requestedMaxADA) * milestone.milestone.percentage) / 100;
    const formattedGoal = formatMoneyByADAOrDollar(percentageGoal);

    return (
        <div className={styles.container}>
            <span className={styles.funds}>Funds {isEditMode && '%'}</span>

            {isEditMode ? (
                <input type="number" min="0" max="100" className={styles.percentageTotal} onChange={handlePercentageChange} value={milestone.milestone.percentage} />
            ) : (
                <span className={styles.percentageTotalSpan}>{`${Math.round(milestone.milestone.percentage)}%`}</span>
            )}

            <span className={styles.percentage}>{formattedGoal}</span>
        </div>
    );
};

export default MilestonePercentage;
