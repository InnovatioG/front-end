import { MilestoneEX } from '@/types/types';
import { daysToWeeks } from '@/utils/formats';
import Image from 'next/image';
import React from 'react';
import styles from './MilestoneTime.module.scss';

interface MilestoneTimeProps {
    milestone: MilestoneEX;
    onChange: (days: number) => void;
    isEditMode: boolean;
}

const MilestoneTime: React.FC<MilestoneTimeProps> = (props) => {
    const { milestone, isEditMode, onChange } = props;
    const weekOptions = [2, 4, 6, 8, 10, 12];

    const handleWeekSelect = (weeks: number) => {
        onChange(weeks * 7);
    };

    const handleResetWeek = () => {
        onChange(0);
    };

    return (
        <div className={styles.general}>
            {milestone.milestone.estimate_delivery_days === 0 && isEditMode ? (
                <div className={styles.timeOptionsContainer}>
                    {weekOptions.map((weeks) => (
                        <button key={weeks} className={styles.timeButton} onClick={() => handleWeekSelect(weeks)}>
                            {weeks} weeks
                        </button>
                    ))}
                </div>
            ) : (
                <div className={styles.finalDelivaryDate}>
                    {isEditMode && (
                        <button onClick={handleResetWeek} className={styles.backButton}>
                            <Image src="/img/icons/arrow-back.svg" alt="arrow-back" width={30} height={30} />
                        </button>
                    )}
                    <span>{milestone.milestone.estimate_delivery_days !== 0 ? daysToWeeks(milestone.milestone.estimate_delivery_days) : 'N/A'} weeks</span>
                </div>
            )}
        </div>
    );
};

export default MilestoneTime;
