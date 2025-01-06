import React from 'react';
import useSubmissionAnswer from '@/hooks/useSubmissionAnswer';
import LoaderDots from '../../LoadingPage/LoaderDots';
import styles from "./ViewReportModal.module.scss"
import GeneralButtonUI from '../buttons/UI/Button';
import { useModalStore } from '@/store/modal/useModalStoreState';



interface ViewReportModalProps {
    id: number | null;
}






const ViewReportModal: React.FC<ViewReportModalProps> = ({ id }) => {
    console.log("id", id);

    const { closeModal } = useModalStore();
    const { answer, loading, approved } = useSubmissionAnswer({ id: id ?? 0 });
    console.log("answer", answer);


    if (loading) {
        return (
            <article className={styles.modalLayout} style={{ alignItems: "center", justifyContent: "center" }} >
                <LoaderDots />
            </article>
        )
    }

    return (
        <article className={styles.modalLayout}>
            <h2 className={styles.title}>
                Campaign  {approved}
            </h2>
            <div className={styles.messageContainer}>
                {approved === "Approved" ? <img src="/img/icons/status/green.svg" alt="green" /> : <img src="/img/icons/status/red.svg" alt="red" />}
                <p>{answer}</p>
            </div>
            <div className={styles.buttonContainer}>
                <GeneralButtonUI text="Continue" classNameStyle='fillb' onClick={closeModal} />
            </div>
        </article>
    );
}

export default ViewReportModal;

