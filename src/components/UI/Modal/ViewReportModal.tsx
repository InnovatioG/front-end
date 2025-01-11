import { useModal } from '@/contexts/ModalContext';
import useSubmissionAnswer from '@/hooks/useSubmissionAnswer';
import React from 'react';
import LoaderDots from '../../LoadingPage/LoaderDots';
import GeneralButtonUI from '../Buttons/UI/Button';
import styles from './ViewReportModal.module.scss';

interface ViewReportModalProps {
    id: string | null;
}

const ViewReportModal: React.FC<ViewReportModalProps> = ({ id }) => {
    const { closeModal } = useModal();
    const { answer, loading, approved } = useSubmissionAnswer({ id: id ?? undefined });

    if (loading) {
        return (
            <article className={styles.modalLayout} style={{ alignItems: 'center', justifyContent: 'center' }}>
                <LoaderDots />
            </article>
        );
    }

    return (
        <article className={styles.modalLayout}>
            <h2 className={styles.title}>Campaign {approved}</h2>
            <div className={styles.messageContainer}>
                {approved === 'Approved' ? <img src="/img/icons/status/green.svg" alt="green" /> : <img src="/img/icons/status/red.svg" alt="red" />}
                <p>{answer}</p>
            </div>
            <div className={styles.buttonContainer}>
                <GeneralButtonUI text="Continue" classNameStyle="fillb" onClick={closeModal} />
            </div>
        </article>
    );
};

export default ViewReportModal;
