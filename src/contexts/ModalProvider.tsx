import ModalTemplate from '@/components/GeneralOK/Modals/ModalTemplate/ModalTemplate';
import ContactSupportModal from '@/components/GeneralOK/Modals/Modals/ContactSupportModal/ContactSupportModal';
import LaunchCampaignModal from '@/components/GeneralOK/Modals/Modals/LaunchCampaignModal/LaunchCampaignModal';
import ManageCampaignSubmissionModal from '@/components/GeneralOK/Modals/Modals/ManageCampaignSubmissionModal/ManageCampaignSubmissionModal';
import ManageMilestoneSubmissionModal from '@/components/GeneralOK/Modals/Modals/ManageMilestoneSubmissionModal/ManageMilestoneSubmissionModal';
import MilestoneSubmissionModal from '@/components/GeneralOK/Modals/Modals/MilestoneSubmissionModal/MilestoneSubmissionModal';
import SingleQuestionModal from '@/components/GeneralOK/Modals/Modals/SingleQuestionModal/SingleQuestionModal';
import SuccessModal from '@/components/GeneralOK/Modals/Modals/SuccessModal/SuccessModal';
import TaskProcessingModal from '@/components/GeneralOK/Modals/Modals/TaskProcessingModal/TaskProcessingModal';
import TxProcessingModal from '@/components/GeneralOK/Modals/Modals/TxProcessingModal/TxProcessingModal';
import TxUserConfirmationModal from '@/components/GeneralOK/Modals/Modals/TxUserConfirmationModal/TxUserConfirmationModal';
import ViewCampaignSubmissionModal from '@/components/GeneralOK/Modals/Modals/ViewCampaignSubmissionModal/ViewCampaignSubmissionModal';
import ViewMilestoneSubmissionModal from '@/components/GeneralOK/Modals/Modals/ViewMilestoneSubmissionModal/ViewMilestoneSubmissionModal';
import WalletConnectorModal from '@/components/GeneralOK/Modals/Modals/WalletConnectorModal/WalletConnectorModal';
import { HandlesEnums, ModalsEnums } from '@/utils/constants/constants';
import { ReactNode, useState } from 'react';
import { ModalContext } from './ModalContext';
import InputAmountModal from '@/components/GeneralOK/Modals/Modals/InputAmountModal/InputAmountModal';

export const ModalProvider = ({ children }: { children: ReactNode }) => {
    const [activeModal, setActiveModal] = useState<ModalsEnums | null>(null);
    const [modalData, setModalData] = useState<Record<string, any> | undefined>(undefined);
    const [handles, setHandles] = useState<Partial<Record<HandlesEnums, (data?: Record<string, any>) => Promise<string | boolean | undefined | void>>> | undefined>(undefined);
    const [dynamicModal, setDynamicModal] = useState<ReactNode | null>(null);

    const openModal = (
        modal: ModalsEnums,
        data?: Record<string, any>,
        handles?: Partial<Record<HandlesEnums, (data?: Record<string, any>) => Promise<string | boolean | undefined | void>>>,
        component?: ReactNode
    ) => {
        setActiveModal(modal);
        setModalData(data || undefined);
        setHandles(handles || undefined);
        setDynamicModal(component || null);
    };

    const closeModal = () => {
        setActiveModal(null);
        setModalData(undefined);
        setHandles(undefined);
        setDynamicModal(null);
    };

    // Predefined modals
    const modalComponents: Partial<Record<ModalsEnums, JSX.Element>> = {
        [ModalsEnums.WALLET_CONNECT]: <WalletConnectorModal />,
        [ModalsEnums.EDIT_SOCIAL_LINK]: undefined,
        [ModalsEnums.DELETE_CAMPAIGN]: <SingleQuestionModal modalType={ModalsEnums.DELETE_CAMPAIGN} handleType={HandlesEnums.DELETE_CAMPAIGN} />,
        [ModalsEnums.SUBMIT_CAMPAIGN]: <SingleQuestionModal modalType={ModalsEnums.SUBMIT_CAMPAIGN} handleType={HandlesEnums.SUBMIT_CAMPAIGN} />,
        [ModalsEnums.MANAGE_CAMPAIGN_SUBMISSIONS]: <ManageCampaignSubmissionModal />,
        [ModalsEnums.VIEW_CAMPAIGN_SUBMISSIONS]: <ViewCampaignSubmissionModal />,
        [ModalsEnums.CREATE_SMART_CONTRACTS]: <SingleQuestionModal modalType={ModalsEnums.CREATE_SMART_CONTRACTS} handleType={HandlesEnums.CREATE_SMART_CONTRACTS} />,
        [ModalsEnums.PUBLISH_SMART_CONTRACTS]: <SingleQuestionModal modalType={ModalsEnums.PUBLISH_SMART_CONTRACTS} handleType={HandlesEnums.PUBLISH_SMART_CONTRACTS} />,
        [ModalsEnums.INITIALIZE_CAMPAIGN]: <LaunchCampaignModal />,
        [ModalsEnums.MANAGE_CAMPAIGN_UTXOS]: <SingleQuestionModal modalType={ModalsEnums.MANAGE_CAMPAIGN_UTXOS} handleType={HandlesEnums.MANAGE_CAMPAIGN_UTXOS} />,
        [ModalsEnums.LAUNCH_CAMPAIGN]: <SingleQuestionModal modalType={ModalsEnums.LAUNCH_CAMPAIGN} handleType={HandlesEnums.LAUNCH_CAMPAIGN} />,
        [ModalsEnums.VALIDATE_FUNDRAISING_STATUS]: <SingleQuestionModal modalType={ModalsEnums.VALIDATE_FUNDRAISING_STATUS} handleType={HandlesEnums.SET_FUNDRAISING_STATUS} />,

        [ModalsEnums.SUBMIT_MILESTONE]: <MilestoneSubmissionModal />,
        [ModalsEnums.MANAGE_MILESTONE_SUBMISSIONS]: <ManageMilestoneSubmissionModal />,
        [ModalsEnums.VIEW_MILESTONE_SUBMISSIONS]: <ViewMilestoneSubmissionModal />,

        [ModalsEnums.COLLECT_FUNDS]: <InputAmountModal modalType={ModalsEnums.COLLECT_FUNDS} handleType={HandlesEnums.COLLECT_FUNDS} />,
        [ModalsEnums.WITHDRAW_TOKENS]: <InputAmountModal modalType={ModalsEnums.WITHDRAW_TOKENS} handleType={HandlesEnums.WITHDRAW_TOKENS} />,
        [ModalsEnums.GETBACK_FUNDS]: <InputAmountModal modalType={ModalsEnums.GETBACK_FUNDS} handleType={HandlesEnums.GETBACK_FUNDS} />,

        [ModalsEnums.CONFIRM_TX]: <TxUserConfirmationModal />,
        [ModalsEnums.PROCESSING_TX]: <TxProcessingModal />,

        [ModalsEnums.PROCESSING_TASK]: <TaskProcessingModal />,

        [ModalsEnums.SUCCESS]: <SuccessModal />,
        [ModalsEnums.CONTACT_SUPPORT]: <ContactSupportModal />,
    };

    return (
        <ModalContext.Provider
            value={{
                activeModal,
                modalData,
                handles,
                openModal,
                closeModal,
            }}
        >
            {activeModal !== null && (
                <ModalTemplate active={activeModal}>
                    {/* Use predefined modal if available, otherwise fallback to dynamic modal */}
                    {modalComponents[activeModal] || dynamicModal || <>Modal {activeModal} Not Implemented</>}
                </ModalTemplate>
            )}

            {children}
        </ModalContext.Provider>
    );
};
