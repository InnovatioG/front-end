import React, { useEffect, useState } from 'react';
import type { MilestoneF } from '@/HardCode/databaseType';
import styles from "./MilestoneMessage.module.scss"
interface MilestoneMessageProps {
    milestone: MilestoneF
}

const MilestoneMessage: React.FC<MilestoneMessageProps> = ({ milestone }) => {
    const [messageType, setMessageType] = useState("");


    useEffect(() => {
        if (!milestone.cmEstimatedDeliveryDate.includes('weeks')) {
            const today = new Date();
            const milestoneDate = new Date(milestone.cmEstimatedDeliveryDate);
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
        <div className={`${styles[messageType]} ${styles.container}`}>
            {messageType == "expire" && <p className='text-red-500'>This milestone is about to expire</p>}
            {messageType == "approved" && <p className='text-green-500'>This milestone has been approved</p>}
            {messageType == "rejected" && <p className='text-red-500'>This milestone has been rejected</p>}
        </div>
    );
}

export default MilestoneMessage;