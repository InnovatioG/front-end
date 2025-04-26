import ModalTemplate from '@/components/GeneralOK/Modals/ModalTemplate/ModalTemplate';
import ContactSupportModal from '@/components/GeneralOK/Modals/Modals/ContactSupportModal/ContactSupportModal';
import ManageCampaignSubmissionModal from '@/components/GeneralOK/Modals/Modals/ManageCampaignSubmissionModal/ManageCampaignSubmissionModal';
import SingleQuestionModal from '@/components/GeneralOK/Modals/Modals/SingleQuestionModal/SingleQuestionModal';
import SuccessModal from '@/components/GeneralOK/Modals/Modals/SuccessModal/SuccessModal';
import TaskProcessingModal from '@/components/GeneralOK/Modals/Modals/TaskProcessingModal/TaskProcessingModal';
import TxProcessingModal from '@/components/GeneralOK/Modals/Modals/TxProcessingModal/TxProcessingModal';
import TxUserConfirmationModal from '@/components/GeneralOK/Modals/Modals/TxUserConfirmationModal/TxUserConfirmationModal';
import ViewCampaignSubmissionModal from '@/components/GeneralOK/Modals/Modals/ViewCampaignSubmissionModal/ViewCampaignSubmissionModal';
import WalletConnectorModal from '@/components/GeneralOK/Modals/Modals/WalletConnectorModal/WalletConnectorModal';
import { HandlesEnums, ModalsEnums } from '@/utils/constants/constants';
import { ReactNode, useState } from 'react';
import { ModalContext } from './ModalContext';

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
        [ModalsEnums.INITIALIZE_CAMPAIGN]: <SingleQuestionModal modalType={ModalsEnums.INITIALIZE_CAMPAIGN} handleType={HandlesEnums.INITIALIZE_CAMPAIGN} />,
        [ModalsEnums.MANAGE_CAMPAIGN_UTXOS]: <SingleQuestionModal modalType={ModalsEnums.MANAGE_CAMPAIGN_UTXOS} handleType={HandlesEnums.MANAGE_CAMPAIGN_UTXOS} />,
        [ModalsEnums.LAUNCH_CAMPAIGN]: <SingleQuestionModal modalType={ModalsEnums.LAUNCH_CAMPAIGN} handleType={HandlesEnums.LAUNCH_CAMPAIGN} />,
        [ModalsEnums.VALIDATE_FUNDRAISING_STATUS]: <SingleQuestionModal modalType={ModalsEnums.VALIDATE_FUNDRAISING_STATUS} handleType={HandlesEnums.SET_REACHED_STATUS} />,
        [ModalsEnums.WITHDRAW_TOKENS_FAILED]: undefined,
        [ModalsEnums.WITHDRAW_TOKENS_UNREACHED]: undefined,
        [ModalsEnums.GETBACK_TOKENS_FAILED]: undefined,
        [ModalsEnums.GETBACK_TOKENS_UNREACHED]: undefined,
        [ModalsEnums.SUBMIT_MILESTONE]: undefined,
        [ModalsEnums.MANAGE_MILESTONE_SUBMISSIONS]: undefined,
        [ModalsEnums.VIEW_MILESTONE_SUBMISSIONS]: undefined,
        [ModalsEnums.COLLECT_FUNDS]: undefined,
        [ModalsEnums.CONTACT_SUPPORT]: <ContactSupportModal />,

        [ModalsEnums.SUCCESS]: <SuccessModal />,

        [ModalsEnums.CONFIRM_TX]: <TxUserConfirmationModal />,
        [ModalsEnums.PROCESSING_TX]: <TxProcessingModal />,

        [ModalsEnums.PROCESSING_TASK]: <TaskProcessingModal />,

        // [ModalEnums.manageCampaignSubmissions]: <ManageCampaignModal  />,
        // [ModalEnums.submitMilestone]: <SendReport campaign={modalState.campaign} />,
        // [ModalEnums.manageMilestoneSubmissions]: <ViewReportModal id={modalState.campaign_id!} />,
        // [ModalEnums.viewMilestoneSubmissions]: <ViewReportMilestone submission={modalState.submission} />,
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
