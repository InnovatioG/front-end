import React from 'react';
import Modal from "react-modal";
import styles from "./Modal.module.scss"




interface ModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    children: React.ReactNode;
}

const ModalTemplate: React.FC<ModalProps> = ({ isOpen, setIsOpen, children }) => {



    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={() => setIsOpen(false)}
            overlayClassName={styles.overlay}
            className={styles.modal}
        >
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={() => setIsOpen(false)}>
                    <span>x</span>
                </button>


                {children}

            </div>
        </Modal>
    );
}

export default ModalTemplate;