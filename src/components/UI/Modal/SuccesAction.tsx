import { useModal } from '@/contexts/ModalContext';
import React from 'react';
import GeneralButtonUI from '../Buttons/UI/Button';
import styles from './ModalTemplate.module.scss';

interface SuccessActionProps {
    // Define props here
}

const SuccessAction: React.FC<SuccessActionProps> = (props) => {
    const { closeModal } = useModal();

    return (
        <article className={styles.modalQuestionLayout} style={{ minWidth: '50dvw', padding: '1rem 2rem' }}>
            <div style={{ justifySelf: 'center', alignSelf: 'center' }}>
                <h2 className={styles.title}>The Campaign detail was successfully updated</h2>
            </div>
            <div className={styles.buttonContainerContact}>
                <GeneralButtonUI text="Back" onClick={closeModal} classNameStyle="outlineb" />

            </div>
        </article>
    );
};

export default SuccessAction;
