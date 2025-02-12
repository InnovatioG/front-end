import { formatDateFromString } from '@/utils/formats';
import React, { useEffect, useState } from 'react';
import styles from './MilestoneMessage.module.scss';
import useMilestoneMessage, { MilestoneMessageProps } from './useMilestoneMessage';
import { ICampaignDetails } from '@/hooks/useCampaingDetails';
import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import Image from 'next/image';

const MilestoneMessage: React.FC<MilestoneMessageProps & ICampaignIdStoreSafe & ICampaignDetails> = (props) => {
    const { milestone, icon } = props;
    const { messageType, handleSendToRevision, lastSubmission } = useMilestoneMessage(props)

    return (
        <div>
            {messageType && (
                <div className={`${styles[messageType]} ${styles.container}`}>
                    <Image src={icon} alt="Milestone status icon" className={styles.icon} width={30} height={30} />
                    {messageType == 'expire' && (
                        <div className={styles.content}>
                            <p className={styles.text}>
                                Time to prepare your report for the next milestone! Remember, the deadline is {formatDateFromString(milestone.milestone.estimate_delivery_date)}. Make sure to
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
