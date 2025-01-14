import { useModal } from '@/contexts/ModalContext';
import { Milestone } from '@/types/types';
import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';
import { formatDateFromString } from '@/utils/formats';
import React, { useEffect, useState } from 'react';
import styles from './MilestoneMessage.module.scss';
import useMilestoneMessage from "@/components/CampaignId/Sections/milestoneMessage/useMilestoneMessage"
interface MilestoneMessageProps {
    milestone: Milestone;
    icon?: string;
}

const MilestoneMessage: React.FC<MilestoneMessageProps> = ({ milestone, icon }) => {
    const { messageType, handleSendToRevision, lastSubmission } = useMilestoneMessage({ milestone })

    return (
        <div>
            {messageType && (
                <div className={`${styles[messageType]} ${styles.container}`}>
                    <img src={icon} alt="icon" className={styles.icon} />
                    {messageType == 'expire' && (
                        <div className={styles.content}>
                            <p className={styles.text}>
                                Time to prepare your report for the next milestone! Remember, the deadline is {formatDateFromString(milestone.estimate_delivery_date)}. Make sure to
                                submit it before this date to avoid marking the milestone as failed, which could trigger a refund process for the campaign. Share as many
                                deliverables as possible&mdash;videos, photos, and detailed documentation&mdash;to showcase a clear roadmap of your progress. Be transparent about
                                how you&apos;re tackling this milestone and your plans for the next steps in this amazing journey. We&apos;re excited to see how far you&apos;ve
                                come!
                            </p>
                            <button onClick={handleSendToRevision} className={styles.button}>
                                Prepare Report
                            </button>
                        </div>
                    )}
                    {messageType == 'approved' && <p className={styles.text}>{lastSubmission?.approved_justification}</p>}
                    {messageType == 'rejected' && <p className={styles.text}>{lastSubmission?.rejected_justification}</p>}
                </div>
            )}
        </div>
    );
};

export default MilestoneMessage;
