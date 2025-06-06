import BtnGeneral from '@/components/GeneralOK/Buttons/BtnGeneral/BtnGeneral';
import { useModal } from '@/contexts/ModalContext';
import { useGeneralStore } from '@/store/generalStore/useGeneralStore';
import { HandlesEnums, ModalsEnums } from '@/utils/constants/constants';
import React, { useEffect, useState } from 'react';
import styles from './SingleQuestionModal.module.scss';

interface SingleQuestionModalProps {
    modalType:
        | ModalsEnums.DELETE_CAMPAIGN
        | ModalsEnums.SUBMIT_CAMPAIGN
        | ModalsEnums.CREATE_SMART_CONTRACTS
        | ModalsEnums.INITIALIZE_CAMPAIGN
        | ModalsEnums.PUBLISH_SMART_CONTRACTS
        | ModalsEnums.MANAGE_CAMPAIGN_UTXOS
        | ModalsEnums.LAUNCH_CAMPAIGN
        | ModalsEnums.VALIDATE_FUNDRAISING_STATUS;
    handleType:
        | HandlesEnums.DELETE_CAMPAIGN
        | HandlesEnums.SUBMIT_CAMPAIGN
        | HandlesEnums.CREATE_SMART_CONTRACTS
        | HandlesEnums.INITIALIZE_CAMPAIGN
        | HandlesEnums.PUBLISH_SMART_CONTRACTS
        | HandlesEnums.MANAGE_CAMPAIGN_UTXOS
        | HandlesEnums.LAUNCH_CAMPAIGN
        | HandlesEnums.SET_FUNDRAISING_STATUS;
}

const SingleQuestionModal: React.FC<SingleQuestionModalProps> = ({ modalType, handleType }) => {
    const { wallet } = useGeneralStore();
    const [isValidEdit, setIsValidEdit] = useState(false);
    useEffect(() => {
        if (wallet !== undefined) {
            setIsValidEdit(true);
        } else if (wallet !== undefined) {
            setIsValidEdit(true);
        } else {
            setIsValidEdit(false);
        }
    }, [wallet]);

    const informationByType = {
        [ModalsEnums.SUBMIT_CAMPAIGN]: {
            title: 'Submit Campaign',
            subtitle: 'Are you sure that you want to submit this campaign?',
            button: {
                no: 'No',
                yes: 'Yes',
            },
        },
        [ModalsEnums.DELETE_CAMPAIGN]: {
            title: 'Delete Campaign',
            subtitle: 'Are you sure that you want to delete this campaign?',
            button: {
                no: 'No',
                yes: 'Yes',
            },
        },
        [ModalsEnums.CREATE_SMART_CONTRACTS]: {
            title: 'Create Smart Contract',
            subtitle: 'Are you sure that you want to create the Smart Contract for this proposal?',
            button: {
                no: 'No',
                yes: 'Yes',
            },
        },
        [ModalsEnums.PUBLISH_SMART_CONTRACTS]: {
            title: 'Publish Smart Contract',
            subtitle: 'Are you sure that you want to publish the Smart Contract for this proposal?',
            button: {
                no: 'No',
                yes: 'Yes',
            },
        },
        [ModalsEnums.INITIALIZE_CAMPAIGN]: {
            title: 'Initialize Campaign',
            subtitle: 'Are you sure that you want to initialize this campaign?',
            button: {
                no: 'No',
                yes: 'Yes',
            },
        },
        [ModalsEnums.MANAGE_CAMPAIGN_UTXOS]: {
            title: 'Manage Campaign UTXOs',
            subtitle: 'Are you sure that you want to prepare the UTXOs for this proposal?',
            button: {
                no: 'No',
                yes: 'Yes',
            },
        },
        [ModalsEnums.LAUNCH_CAMPAIGN]: {
            title: 'Launch Campaign',
            subtitle: 'Are you sure that you want to launch this campaign?',
            button: {
                no: 'No',
                yes: 'Yes',
            },
        },
        [ModalsEnums.VALIDATE_FUNDRAISING_STATUS]: {
            title: 'Validate Fundraising Status',
            subtitle: 'Are you sure that you want to validate the fundraising status for this proposal?',
            button: {
                no: 'No',
                yes: 'Yes',
            },
        },
        // collect: {
        //     title: 'Collect Funds',
        //     subtitle: 'Are you sure that you want to collect the funds of this milestone?',
        //     button: {
        //         no: 'No',
        //         yes: 'Yes',
        //     },
        // },

        // withdrawTokens: {
        //     title: 'Withdraw Tokens',
        //     subtitle: 'Are you sure that you want to withdraw the tokens for this proposal?',
        //     button: {
        //         no: 'No',
        //         yes: 'Yes',
        //     },
        // },
    };
    const { closeModal, handles, modalData } = useModal();

    const handleClick = async () => {
        console.log(`handleClick: ${handleType}`);
        if (handles && handles[handleType]) {
            let data = { ...modalData };
            if (handleType === HandlesEnums.SUBMIT_CAMPAIGN) {
                if (wallet === undefined) return;
                data = { ...modalData, submitted_by_wallet_id: wallet._DB_id };
            }
            await handles[handleType](data);
        } else {
            alert(`No handle ${handleType} provided`);
        }
        // NOTE: no lo cierro, por que se abre otro modal, el de success
        // closeModal();
    };

    return (
        <div className={styles.modalQuestionLayout}>
            <h2>
                {/* Are you sure that you want to create the Smart Contract for this proposal? */}
                {informationByType[modalType].subtitle}
            </h2>
            <div className={styles.buttonContainer}>
                <BtnGeneral text="No" onClick={() => closeModal()} classNameStyle="outlineb" />
                <BtnGeneral text="Yes" onClick={() => handleClick()} classNameStyle="fillb" disabled={!isValidEdit} />
            </div>
        </div>
    );
};

export default SingleQuestionModal;
