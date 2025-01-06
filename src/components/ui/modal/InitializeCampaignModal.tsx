import React from 'react';
import { useModalStore } from '@/store/modal/useModalStoreState';
import styles from "./Modal.module.scss"
import GeneralButtonUI from '../buttons/UI/Button';
import { title } from 'process';



/* !! COMPONENTE QUE SE PUEDE REPETIR */
interface InitializeCampaignModalProps {
    modalType: "initializeCampaign" | "createSmartContract" | "publishSmartContract" | "validateFundraisingStatus" | "collect" | "withdrawTokens";
}

const SingleQuestionModal: React.FC<InitializeCampaignModalProps> = ({ modalType }) => {


    const informationByType = {
        initializeCampaign: {
            title: "Initialize Campaign",
            subtitle: "Are you sure that you want to initialize this campaign?",
            button: {
                no: "No",
                yes: "Yes"
            }
        },
        createSmartContract: {
            title: "Create Smart Contract",
            subtitle: "Are you sure that you want to create the Smart Contract for this proposal?",
            button: {
                no: "No",
                yes: "Yes"
            }
        },
        collect: {
            title: "Collect Funds",
            subtitle: "Are you sure that you want to collect the funds of this milestone?",
            button: {
                no: "No",
                yes: "Yes"
            }
        },
        publishSmartContract: {
            title: "Publish Smart Contract",
            subtitle: "Are you sure that you want to publish the Smart Contract for this proposal?",
            button: {
                no: "No",
                yes: "Yes"
            }
        },
        withdrawTokens: {
            title: "Withdraw Tokens",
            subtitle: "Are you sure that you want to withdraw the tokens for this proposal?",
            button: {
                no: "No",
                yes: "Yes"
            }
        },
        validateFundraisingStatus: {
            title: "Validate Fundraising Status",
            subtitle: "Are you sure that you want to validate the fundraising status for this proposal?",
            button: {
                no: "No",
                yes: "Yes"
            }
        }
    }


    const { closeModal } = useModalStore();
    return (
        <div className={styles.modalQuestionLayout}>
            <h2>{/* Are you sure that you want to create the Smart Contract for this proposal? */}
                {informationByType[modalType].subtitle}
            </h2>
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

export default SingleQuestionModal;