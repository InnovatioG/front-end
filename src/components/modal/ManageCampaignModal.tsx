import React, { useState } from 'react';
import styles from "./ManageCampaignModal.module.scss";
import GeneralButtonUI from '../buttons/UI/Button';
import { useModal } from '@/contexts/ModalContext';

interface ManageCampaignModalProps {
    id: number | null;
}

/* MODAL PARA LOS PROTOCOL MANAGER PARA QUE PUEDAN ACEPTAR O RECHAZAR EL MILESTONE  */

const ManageCampaignModal: React.FC<ManageCampaignModalProps> = ({ id }) => {
    const { closeModal } = useModal();
    const [status, setStatus] = useState<boolean | null>(null);
    const [description, setDescription] = useState("");

    const handleConfirm = () => {
        console.log("Confirm", { id, status, description });
        // Aquí puedes agregar la lógica para manejar la confirmación
        closeModal();
    };

    return (
        <article className={styles.generalContainer}>
            <header className={styles.titleSection}>
                <h3>Approve or Reject</h3>
                <h3>Project Submission</h3>
            </header>
            <div className={styles.buttonStatusContainer}>
                <GeneralButtonUI
                    classNameStyle={`outlineb ${status === true ? "selected" : ''}`}
                    onClick={() => setStatus(true)}
                >
                    <div className={styles.greenCircle}></div>
                    <span className={`${status === true ? `${styles.selected}` : ""}`}>Approve Campaign</span>
                </GeneralButtonUI>
                <GeneralButtonUI
                    classNameStyle={`outlineb ${status === false ? "selected" : ''}`}
                    onClick={() => setStatus(false)}
                >
                    <div className={styles.redCircle}></div>
                    <span className={`${status === false ? `${styles.selected}` : ""}`}>Reject Campaign</span>
                </GeneralButtonUI>
            </div>
            <div className={styles.text}>
                <div className={styles.textContainer}>
                    <label htmlFor="">Context and Description</label>
                    <textarea
                        className={styles.textarea}
                        placeholder="Send message report about the approbation or rejection of the crowdfunding proposal."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        maxLength={650}
                    />
                </div>
                <div className={styles.buttonContainer}>
                    <GeneralButtonUI classNameStyle='outlineb' text='Back' onClick={closeModal} />
                    <GeneralButtonUI classNameStyle='fillb' text='Confirm' onClick={handleConfirm} />
                </div>
            </div>
        </article>
    );
}

export default ManageCampaignModal;