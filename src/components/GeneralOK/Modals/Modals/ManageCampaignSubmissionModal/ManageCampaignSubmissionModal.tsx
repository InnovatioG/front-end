import BtnGeneral from '@/components/GeneralOK/Buttons/BtnGeneral/BtnGeneral';
import { useModal } from '@/contexts/ModalContext';
import { useGeneralStore } from '@/store/generalStore/useGeneralStore';
import { HandlesEnums } from '@/utils/constants/constants';
import React, { useEffect, useState } from 'react';
import styles from './ManageCampaignSubmissionModal.module.scss';

interface ManageCampaignModalProps {}

/* MODAL PARA LOS PROTOCOL MANAGER PARA QUE PUEDAN ACEPTAR O RECHAZARla campaña */

const ManageCampaignSubmissionModal: React.FC<ManageCampaignModalProps> = ({}) => {
    const { closeModal, handles, modalData } = useModal();
    const [status, setStatus] = useState<boolean | null>(null);
    const [description, setDescription] = useState('');
    const [isValidEdit, setIsValidEdit] = useState(false);

    const { wallet } = useGeneralStore();

    useEffect(() => {
        if (wallet !== undefined && status === true && description.length > 0) {
            setIsValidEdit(true);
        } else if (wallet !== undefined && status === false && description.length > 0) {
            setIsValidEdit(true);
        } else {
            setIsValidEdit(false);
        }
    }, [status, description, wallet]);

    const handleConfirm = async () => {
        // Aquí puedes agregar la lógica para manejar la confirmación
        if (wallet === undefined) return;

        const data = { ...modalData, revised_by_wallet_id: wallet._DB_id, justification: description };

        if (status === true) {
            console.log(`handleClick: ${HandlesEnums.APPROVE_CAMPAIGN}`);
            if (handles && handles[HandlesEnums.APPROVE_CAMPAIGN]) {
                await handles[HandlesEnums.APPROVE_CAMPAIGN](data);
            } else {
                alert(`No handle ${HandlesEnums.APPROVE_CAMPAIGN} provided`);
            }
        } else if (status === false) {
            console.log(`handleClick: ${HandlesEnums.REJECT_CAMPAIGN}`);
            if (handles && handles[HandlesEnums.REJECT_CAMPAIGN]) {
                await handles[HandlesEnums.REJECT_CAMPAIGN](data);
            } else {
                alert(`No handle ${HandlesEnums.REJECT_CAMPAIGN} provided`);
            }
        }
        closeModal();
    };

    return (
        <article className={styles.generalContainer}>
            <header className={styles.titleSection}>
                <h3>Approve or Reject</h3>
                <h3>Project Submission</h3>
            </header>
            <div className={styles.buttonStatusContainer}>
                <BtnGeneral classNameStyle={`outlineb ${status === true ? 'selected' : ''}`} onClick={() => setStatus(true)}>
                    <div className={styles.greenCircle}></div>
                    <span className={`${status === true ? `${styles.selected}` : ''}`}>Approve Campaign</span>
                </BtnGeneral>
                <BtnGeneral classNameStyle={`outlineb ${status === false ? 'selected' : ''}`} onClick={() => setStatus(false)}>
                    <div className={styles.redCircle}></div>
                    <span className={`${status === false ? `${styles.selected}` : ''}`}>Reject Campaign</span>
                </BtnGeneral>
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
                    <BtnGeneral classNameStyle="outlineb" text="Back" onClick={closeModal} />
                    <BtnGeneral classNameStyle="fillb" text="Confirm" onClick={handleConfirm} disabled={!isValidEdit} />
                </div>
            </div>
        </article>
    );
};

export default ManageCampaignSubmissionModal;
