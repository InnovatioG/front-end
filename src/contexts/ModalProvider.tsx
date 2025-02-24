import { HandlesEnums, ModalsEnums } from '@/utils/constants/constants';
import { ReactNode, useState } from 'react';
import { ModalContext } from './ModalContext';
import ModalTemplate from '@/components/GeneralOK/Modals/ModalTemplate/ModalTemplate';
import WalletConnectorModal from '@/components/GeneralOK/Modals/Modals/WalletConnectorModal/WalletConnectorModal';
import LaunchCampaignModal from '@/components/GeneralOK/Modals/Modals/LaunchCampaignModal/LaunchCampaignModal';
import ContactSupportModal from '@/components/GeneralOK/Modals/Modals/ContactSupportModal/ContactSupportModal';
import SingleQuestionModal from '@/components/GeneralOK/Modals/Modals/SingleQuestionModal/SingleQuestionModal';
import SuccessModal from '@/components/GeneralOK/Modals/Modals/SuccessModal/SuccessModal';

export const ModalProvider = ({ children }: { children: ReactNode }) => {
    const [activeModal, setActiveModal] = useState<ModalsEnums | null>(null);
    const [modalData, setModalData] = useState<Record<string, any> | undefined>(undefined);
    const [handles, setHandles] = useState<Partial<Record<HandlesEnums, (data?: Record<string, any>) => Promise<string | undefined | void>>> | undefined>(undefined);
    const [dynamicModal, setDynamicModal] = useState<ReactNode | null>(null);

    const openModal = (
        modal: ModalsEnums,
        data?: Record<string, any>,
        handles?: Partial<Record<HandlesEnums, (data?: Record<string, any>) => Promise<string | undefined | void>>>,
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
        [ModalsEnums.DELETE_CAMPAIGN]: undefined,
        [ModalsEnums.SUBMIT_CAMPAIGN]: <SingleQuestionModal modalType={ModalsEnums.SUBMIT_CAMPAIGN} handleType={HandlesEnums.SUBMIT_CAMPAIGN} />,
        [ModalsEnums.MANAGE_CAMPAIGN_SUBMISSIONS]: undefined,
        [ModalsEnums.VIEW_CAMPAIGN_SUBMISSIONS]: undefined,
        [ModalsEnums.CREATE_SMART_CONTRACTS]: <SingleQuestionModal modalType={ModalsEnums.CREATE_SMART_CONTRACTS} handleType={HandlesEnums.CREATE_SMART_CONTRACTS} />,
        [ModalsEnums.PUBLISH_SMART_CONTRACTS]: <SingleQuestionModal modalType={ModalsEnums.PUBLISH_SMART_CONTRACTS} handleType={HandlesEnums.PUBLISH_SMART_CONTRACTS} />,
        [ModalsEnums.INITIALIZE_CAMPAIGN]: <SingleQuestionModal modalType={ModalsEnums.INITIALIZE_CAMPAIGN} handleType={HandlesEnums.INITIALIZE_CAMPAIGN} />,
        [ModalsEnums.MANAGE_CAMPAIGN_UTXOS]: undefined,
        [ModalsEnums.LAUNCH_CAMPAIGN]: <LaunchCampaignModal />,
        [ModalsEnums.VALIDATE_FUNDRAISING_STATUS]: (
            <SingleQuestionModal modalType={ModalsEnums.VALIDATE_FUNDRAISING_STATUS} handleType={HandlesEnums.SET_REACHED_STATUS} />
        ),
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
