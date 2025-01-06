import React, { useEffect, useState } from 'react';
import type { MilestoneF } from '@/HardCode/databaseType';
import styles from "./MilestoneMessage.module.scss"
import { formatDateFromString } from '@/utils/formats';
import GeneralButtonUI from '../ui/buttons/UI/Button';
import { useModalStore } from '@/store/modal/useModalStoreState';
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
interface MilestoneMessageProps {
    milestone: MilestoneF
    icon: string
}

const MilestoneMessage: React.FC<MilestoneMessageProps> = ({ milestone, icon }) => {
    const [messageType, setMessageType] = useState("");
    const { openModal } = useModalStore();

    const { project } = useProjectDetailStore();

    const handleSendToRevision = () => {
        openModal("sendReport", project.id, project);
    }


    useEffect(() => {
        if (!milestone.estimatedDeliveryDate.includes('weeks')) {

            const today = new Date();
            const milestoneDate = new Date(milestone.estimatedDeliveryDate);
            const diffTime = milestoneDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays > 0 && diffDays <= 7) {
                setMessageType("expire");
            } else {
                setMessageType(""); // Asegura que se resetee si no cumple la condición
            }
        }
        console.log(milestone)

        if (milestone.milestone_status?.milestone_submission.approved_justification) {
            setMessageType("approved")
        }

        if (milestone.milestone_status?.milestone_submission.rejected_justification) {
            setMessageType("rejected")
        }



    }, [milestone]);

    return (
        <div>
            {messageType &&
                <div className={`${styles[messageType]} ${styles.container}`}>
                    <img src={icon} alt="icon" className={styles.icon} />
                    {messageType == "expire" && (
                        <div className={styles.content}>
                            <p className={styles.text}>
                                Time to prepare your report for the next milestone! Remember, the deadline is {formatDateFromString(milestone.estimatedDeliveryDate)}. Make sure to submit it before this date to avoid marking the milestone as failed, which could trigger a refund process for the campaign. Share as many deliverables as possible&mdash;videos, photos, and detailed documentation&mdash;to showcase a clear roadmap of your progress. Be transparent about how you&apos;re tackling this milestone and your plans for the next steps in this amazing journey. We&apos;re excited to see how far you&apos;ve come!

                            </p>
                            <button onClick={handleSendToRevision} className={styles.button}>
                                Prepare Report
                            </button>
                        </div>
                    )
                    }
                    {messageType == "approved" && <p className={styles.text}>{milestone.milestone_status?.milestone_submission.approved_justification}</p>}
                    {messageType == "rejected" && <p className={styles.text}>{milestone.milestone_status?.milestone_submission.rejected_justification}</p>}
                </div >
            }
        </div>
    );
}

export default MilestoneMessage;