/* TODO MOVE TO A DIFFERENT FOLDER CAMPAIGN EDIT */


import type { Milestone } from '@/types/types';
import { usePriceStore } from '@/store/price/usepriceAdaOrDollar';
import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';
import { formatMoney } from '@/utils/formats';
import React, { useEffect, useState } from 'react';
import styles from './MilestonePercentage.module.scss';
import { useGeneralStore } from '@/store/generalConstants/useGeneralConstants';
import useMilestonePercentage from '@/components/CampaignCreation/Elements/MilestonePercentage/useMilestonePercentage'
interface MilestonePercentageProps {
    milestone: Milestone;
    goal: number; // Goal total
    maxAvailablePercentage: number;
    onPercentageChange: (percentage: number) => boolean;
}

const MilestonePercentage: React.FC<MilestonePercentageProps> = ({ milestone, goal, maxAvailablePercentage, onPercentageChange }) => {
    const { editionMode } = useCampaignIdStore();
    const { percentage, setPercentage, handlePercentageChange, formattedGoal } = useMilestonePercentage(milestone, goal, maxAvailablePercentage, onPercentageChange);


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
