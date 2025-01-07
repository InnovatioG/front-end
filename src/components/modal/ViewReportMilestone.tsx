import React from 'react';
import styles from "./ViewReportModal.module.scss"
import GeneralButtonUI from '../buttons/UI/Button';
import { useModal } from '@/contexts/ModalContext';
interface ViewReportMilestoneProps {
    submission: string | undefined;
}

const ViewReportMilestone: React.FC<ViewReportMilestoneProps> = ({ submission }) => {

    const { closeModal } = useModal();

    return (
        <article className={styles.modalLayout}>
            <h2 className={styles.title}>
                Milestone Submission
            </h2>
            <div className={styles.messageContainer}>
                <p>{submission}</p>
            </div>
            <div className={styles.buttonContainer}>
                <GeneralButtonUI text="Close" classNameStyle='fillb' onClick={closeModal} />
            </div>
        </article>
    );
}

export default ViewReportMilestone;