import type { Milestone } from '@/types/types';
import { usePriceStore } from '@/store/price/usepriceAdaOrDollar';
import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';
import { formatMoney } from '@/utils/formats';
import React, { useEffect, useState } from 'react';
import styles from './MilestonePercentage.module.scss';
import { useGeneralStore } from '@/store/generalConstants/useGeneralConstants';

interface MilestonePercentageProps {
    milestone: Milestone;
    goal: number; // Goal total
    maxAvailablePercentage: number;
    onPercentageChange: (percentage: number) => boolean;
}

const MilestonePercentage: React.FC<MilestonePercentageProps> = ({ milestone, goal, maxAvailablePercentage, onPercentageChange }) => {
    const [percentage, setPercentage] = useState<number>(milestone.percentage);
    const { editionMode } = useCampaignIdStore();
    const { priceAdaOrDollar } = usePriceStore();
    const { adaPrice } = useGeneralStore();

    useEffect(() => {
        setPercentage(milestone.percentage);
    }, [milestone.percentage]);

    const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, ''); // Remove non-digits
        if (value === '' || /^\d+$/.test(value)) {
            const newValue = value === '' ? 0 : Math.min(100, parseInt(value, 10));
            const success = onPercentageChange(newValue);
            if (success) {
                setPercentage(newValue);
            }
        }
    };

    const goalInCurrentCurrency = priceAdaOrDollar === 'dollar' ? Number(goal) : Number(goal) / adaPrice;
    const currencySymbol = priceAdaOrDollar === 'dollar' ? 'USD' : 'ADA';

    const percentageGoal = (goalInCurrentCurrency * percentage) / 100;
    const formattedGoal = formatMoney(percentageGoal, currencySymbol);

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
