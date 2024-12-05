import React from 'react';
import { useModalStore } from '@/store/modal/useModalStoreState';
import styles from "./Modal.module.scss"
import GeneralButtonUI from '../buttons/UI/Button';



/* !! COMPONENTE QUE SE PUEDE REPETIR */
interface InitializeCampaignModalProps {
    // Define props here
}

const InitializeCampaignModal: React.FC<InitializeCampaignModalProps> = (props) => {

    const { closeModal } = useModalStore();
    return (
        <div className={styles.modalQuestionLayout}>
            <h2>Are you sure that you want to create the Smart Contract for this proposal?</h2>
            <div className={styles.buttonContainer}>
                <GeneralButtonUI
                    text='No'
                    onClick={() => closeModal()}
                    classNameStyle='outlineb'
                />
                <GeneralButtonUI
                    text='Yes'
                    onClick={() => console.log("Create")}
                    classNameStyle='fillb'
                />
            </div>
        </div>
    );
}

export default InitializeCampaignModal;