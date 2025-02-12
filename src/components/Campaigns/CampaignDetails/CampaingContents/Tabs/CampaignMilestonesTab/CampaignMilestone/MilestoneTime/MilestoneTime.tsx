import { ICampaignDetails } from '@/hooks/useCampaingDetails';
import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import { MilestoneEX } from '@/types/types';
import { daysToWeeks } from '@/utils/formats';
import React from 'react';
import styles from './MilestoneTime.module.scss';
import Image from 'next/image';

interface MilestoneTimeProps {
    milestone: MilestoneEX;
}

const MilestoneTime: React.FC<MilestoneTimeProps & ICampaignIdStoreSafe & ICampaignDetails> = (props) => {
    const { milestone, campaign, setCampaignEX, setMilestoneEX, isEditMode } = props;
    const weekOptions = [2, 3, 4, 5];

    const handleWeekSelect = (weeks: number) => {
        const updatedMilestone = {
            ...milestone,
            estimate_delivery_days: weeks * 7,
        };
        const updatedMilestones = (campaign.milestones ?? []).map((m) => (m.milestone._DB_id === milestone.milestone._DB_id ? updatedMilestone : m));
        setCampaignEX({
            ...campaign,
            milestones: updatedMilestones,
        });
        setMilestoneEX(updatedMilestone);
    };

    const handleResetWeek = () => {
        const updatedMilestone = {
            ...milestone,
            estimate_delivery_days: undefined,
        };
        const updatedMilestones = (campaign.milestones ?? []).map((m) => (m.milestone._DB_id === milestone.milestone._DB_id ? updatedMilestone : m));
        setCampaignEX({
            ...campaign,
            milestones: updatedMilestones,
        });
        setMilestoneEX(updatedMilestone);
    };

    return (
        <div className={styles.general}>
            {milestone.milestone.estimate_delivery_days === undefined && isEditMode ? (
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
                    <span>{milestone.milestone.estimate_delivery_days !== undefined ? daysToWeeks(milestone.milestone.estimate_delivery_days) : 'N/A'} weeks</span>
                </div>
            )}
        </div>
    );
};

export default MilestoneTime;
