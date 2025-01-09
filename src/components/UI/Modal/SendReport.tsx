import { useModal } from '@/contexts/ModalContext';
import type { Campaign } from '@/HardCode/databaseType';
import useDraftCard from '@/hooks/useDraftCard';
import { getOrdinalString } from '@/utils/formats';
import React, { useState } from 'react';
import GeneralButtonUI from '../Buttons/UI/Button';
import styles from './ViewReportModal.module.scss';

interface SendReportMilestoneProps {
    campaign: Campaign | undefined;
}

const SendReportMilestone: React.FC<SendReportMilestoneProps> = ({ campaign }) => {
    const [report, setReport] = useState('');

    if (!campaign) return null; // o algún otro comportamiento por defecto

    //TODO: esta mal el uso de useDraftCard react-hooks/rules-of-hooks

    const {
        label,
        labelClass,
        buttons,
        timeRemaining,
        formatAllTime,
        currentMilestone,
        // eslint-disable-next-line react-hooks/rules-of-hooks
    } = useDraftCard(campaign, false, true);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { closeModal } = useModal();

    const numberFromCurrentMilestone = getOrdinalString(Number(currentMilestone.charAt(1)));

    return (
        <article className={styles.modalLayout}>
            <h1 className={styles.title}>{numberFromCurrentMilestone} Campaign Milestone </h1>
            <div className={styles.textAreaContainer}>
                <textarea
                    name=""
                    id=""
                    cols={30}
                    rows={10}
                    className={styles.textArea}
                    placeholder="Maximum 5000 characters"
                    maxLength={5000}
                    value={report}
                    onChange={(e) => setReport(e.target.value)}
                ></textarea>
                <label htmlFor="" className={styles.count}>
                    {report.length} / 5000
                </label>
            </div>
            <div className={styles.buttonContainerSendReport}>
                <GeneralButtonUI text="Cancel" classNameStyle="outlineb" onClick={closeModal} />
                <GeneralButtonUI text="Confirm" classNameStyle="fillb" onClick={closeModal} />
            </div>
        </article>
    );
};

export default SendReportMilestone;
