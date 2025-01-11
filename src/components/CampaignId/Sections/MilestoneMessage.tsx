import { useModal } from '@/contexts/ModalContext';
import { Milestone } from '@/types/types';
import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';
import { formatDateFromString } from '@/utils/formats';
import React, { useEffect, useState } from 'react';
import styles from './MilestoneMessage.module.scss';
interface MilestoneMessageProps {
    milestone: Milestone;
    icon?: string;
}

const MilestoneMessage: React.FC<MilestoneMessageProps> = ({ milestone, icon }) => {
    const [messageType, setMessageType] = useState('');
    const { openModal } = useModal();
    const { campaign } = useCampaignIdStore();
    const { estimate_delivery_date } = milestone

    const today = new Date();
    const handleSendToRevision = () => {
        openModal('sendReport', { campaign_id: campaign._DB_id, campaign });
    };
    const lastSubmission = milestone.milestone_submissions?.slice(-1)[0];


    console.log("milestone estimate_delivery_date: ", estimate_delivery_date)

    useEffect(() => {
        if (estimate_delivery_date) {
            const today = new Date();
            console.log(today)
            console.log(estimate_delivery_date.getTime())
            const diffTime = estimate_delivery_date.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            console.log(diffDays)
            if (diffDays > 0 && diffDays <= 7) {
                setMessageType('expire');
            } else {
                setMessageType(''); // Asegura que se resetee si no cumple la condición
            }
        }

        if (lastSubmission?.approved_justification) {
            setMessageType('approved');
        }

        if (lastSubmission?.rejected_justification) {
            setMessageType('rejected');
        }
    }, [milestone]);

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
