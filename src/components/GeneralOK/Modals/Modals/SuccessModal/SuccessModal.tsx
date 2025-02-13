import { useModal } from '@/contexts/ModalContext';
import React from 'react';
import styles from './SuccessModal.module.scss';
import BtnGeneral from '@/components/GeneralOK/Buttons/BtnGeneral/BtnGeneral';

interface SuccessModalProps {
    // Define props here
}

const SuccessModal: React.FC<SuccessModalProps> = (props) => {
    const { closeModal } = useModal();

    return (
        <article className={styles.modalQuestionLayout} style={{ minWidth: '50dvw', padding: '1rem 2rem' }}>
            <div style={{ justifySelf: 'center', alignSelf: 'center' }}>
                <h2 className={styles.title}>The Campaign was successfully updated</h2>
            </div>
            <div className={styles.buttonContainerContact}>
                <BtnGeneral text="Close" onClick={closeModal} classNameStyle="fillb" />
            </div>
        </article>
    );
};

export default SuccessModal;
