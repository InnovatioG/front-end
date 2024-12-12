import React, { useState } from 'react';
import { useModalStore } from '@/store/modal/useModalStoreState';
import styles from "./ViewReportModal.module.scss"
import useDraftCard from '@/hooks/useDraftCard';
import type { Campaign } from '@/HardCode/databaseType';
import { getOrdinalString } from '@/utils/formats';
import GeneralButtonUI from '../buttons/UI/Button';

interface SendReportMilestoneProps {
    campaign: Campaign | undefined

}

const SendReportMilestone: React.FC<SendReportMilestoneProps> = ({ campaign }) => {
    const [report, setReport] = useState('');


    if (!campaign) return null; // o algún otro comportamiento por defecto

    const { label,
        labelClass,
        buttons,
        timeRemaining,
        formatAllTime,
        // eslint-disable-next-line react-hooks/rules-of-hooks
        currentMilestone, } = useDraftCard(campaign, false);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { closeModal } = useModalStore();


    const numberFromCurrentMilestone = getOrdinalString(Number(currentMilestone.charAt(1)))

    return (
        <article className={styles.modalLayout}>
            <h1 className={styles.title}>{numberFromCurrentMilestone} Campaign Milestone </h1>
            <div className={styles.textAreaContainer}>
                <textarea name="" id="" cols={30} rows={10} className={styles.textArea} placeholder='Maximum 5000 characters' maxLength={5000}
                    value={report}
                    onChange={(e) => setReport(e.target.value)}
                ></textarea>
                <label htmlFor="" className={styles.count}>
                    {report.length} / 5000
                </label>

            </div>
            <div className={styles.buttonContainerSendReport}>
                <GeneralButtonUI text="Cancel" classNameStyle='outlineb' onClick={closeModal} />
                <GeneralButtonUI text="Confirm" classNameStyle='fillb' onClick={closeModal} />

            </div>
        </article>
    );
}

export default SendReportMilestone;