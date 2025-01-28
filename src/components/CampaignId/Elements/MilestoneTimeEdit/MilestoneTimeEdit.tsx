import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';
import { formatDateFromString, daysToWeeks } from '@/utils/formats';
import React from 'react';
import styles from './MilestoneTimeEdit.module.scss';
import { Milestone } from '@/types/types';


//! TODO 

interface MilestoneTimeEditProps {
    milestone: Milestone;
}

const numberToWords: { [key: number]: string } = {
    2: '2',
    3: '3',
    4: '4',
    5: '5',
};

const MilestoneTimeEdit: React.FC<MilestoneTimeEditProps> = ({ milestone }) => {
    const { campaign, setCampaign, setMilestone, editionMode } = useCampaignIdStore();
    const weekOptions = [2, 3, 4, 5];



    const handleWeekSelect = (weeks: number) => {
        const updatedMilestone = {
            ...milestone,
            estimate_delivery_days: weeks * 7,
/*             estimatedDeliveryDate: `${numberToWords[weeks]} weeks`,
 */        };
        const updatedMilestones = (campaign.milestones ?? []).map((m) => (m._DB_id === milestone._DB_id ? updatedMilestone : m));
        setCampaign({
            ...campaign,
            milestones: updatedMilestones,
        });
        setMilestone(updatedMilestone);
    };

    const handleResetWeek = () => {
        const updatedMilestone = {
            ...milestone,
            estimate_delivery_days: undefined,
        };
        const updatedMilestones = (campaign.milestones ?? []).map((m) => (m._DB_id === milestone._DB_id ? updatedMilestone : m));
        setCampaign({
            ...campaign,
            milestones: updatedMilestones,
        });
        setMilestone(updatedMilestone);
    };

    return (
        <div className={styles.general}>
            {milestone.estimate_delivery_days === undefined && editionMode ? (
                <div className={styles.timeOptionsContainer}>
                    {weekOptions.map((weeks) => (
                        <button key={weeks} className={styles.timeButton} onClick={() => handleWeekSelect(weeks)}>
                            {weeks} weeks
                        </button>
                    ))}
                </div>
            ) : (
                <div className={styles.finalDelivaryDate}>
                    {editionMode && (
                        <button onClick={handleResetWeek} className={styles.backButton}>
                            <img src="/img/icons/arrow-back.svg" alt="arrow-back" />
                        </button>
                    )}
                    <span>{milestone.estimate_delivery_days !== undefined ? daysToWeeks(milestone.estimate_delivery_days) : 'N/A'} weeks</span>
                </div>
            )}
        </div>
    );
};

export default MilestoneTimeEdit;

/* 
const MilestoneTimeEdit = () => {
    const weekOptions = [2, 3, 4, 5];

    return (
        <div className={styles.timeOptionsContainer}>
            {weekOptions.map(weeks => (
                <button
                    key={weeks}
                    className={styles.timeButton}
                >
                    {weeks} weeks
                </button>
            ))}
        </div>
    );
}

export default MilestoneTimeEdit; */
