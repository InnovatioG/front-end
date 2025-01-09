import { useModal } from '@/contexts/ModalContext';
import React from 'react';
import GeneralButtonUI from '../Buttons/UI/Button';
import styles from './ModalTemplate.module.scss';

interface ContactSupportModalProps {
    // Define props here
}

const ContactSupportModal: React.FC<ContactSupportModalProps> = (props) => {
    const { closeModal } = useModal();

    return (
        <article className={styles.modalQuestionLayout} style={{ minWidth: '50dvw', padding: '1rem 2rem' }}>
            <div style={{ justifySelf: 'center', alignSelf: 'center' }}>
                <h2 className={styles.title}>Contact Support Team</h2>
            </div>
            <div className={styles.textAreaContainer}>
                <label htmlFor="">Redact Email Message to our Team</label>
                <textarea name="" id="" cols={30} rows={10} className={styles.textArea}></textarea>
            </div>
            <div className={styles.buttonContainerContact}>
                <GeneralButtonUI text="Back" onClick={closeModal} classNameStyle="outlineb" />
                <GeneralButtonUI text="Arrange Meeting" onClick={() => console.log('Send')} classNameStyle="outlineb" />
                <GeneralButtonUI text="Send Email" onClick={() => console.log('Send')} classNameStyle="fillb" />
            </div>
        </article>
    );
};

export default ContactSupportModal;
