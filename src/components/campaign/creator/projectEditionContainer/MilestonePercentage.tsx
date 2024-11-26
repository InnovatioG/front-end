import React, { useEffect, useState } from 'react';
import type { MilestoneF } from "@/HardCode/databaseType";
import styles from "./MilestonePercentage.module.scss";
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';

interface MilestonePercentageProps {
    milestone: MilestoneF;
    goal: number; // Goal total
    maxAvailablePercentage: number;
    onPercentageChange: (percentage: number) => boolean;
}

const MilestonePercentage: React.FC<MilestonePercentageProps> = ({
    milestone,
    goal,
    maxAvailablePercentage,
    onPercentageChange,
}) => {
    const [percentage, setPercentage] = useState<number>(milestone.percentage);
    const { editionMode } = useProjectDetailStore();

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

    const percentageGoal = (goal * percentage) / 100;
    const formattedGoal = `$${percentageGoal.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })}`;

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