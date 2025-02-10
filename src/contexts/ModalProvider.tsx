import CalendarModal from '@/components/General/Modal/CalendarModal';
// import ContactSupportModal from '@/components/General/Modal/ContactSupportModal';
// import SingleQuestionModal from '@/components/General/Modal/InitializeCampaignModal';
// import ManageCampaignModal from '@/components/General/Modal/ManageCampaignModal';
import ModalTemplate from '@/components/General/Modal/ModalTemplate';
// import SendReport from '@/components/General/Modal/SendReport';
// import ViewReportMilestone from '@/components/General/Modal/ViewReportMilestone';
// import ViewReportModal from '@/components/General/Modal/ViewReportModal';
import WalletInformationModal from '@/components/General/Modal/WalletInformation';
import { WalletSelectorModal } from '@/components/General/Modal/WalletSelectorModal';
import { useState } from 'react';
import { IModalState, ModalContext } from './ModalContext';
// import SuccessAction from '@/components/General/Modal/SuccesAction';

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [modalState, setModalState] = useState<IModalState>({ isOpen: false });

    const openModal = (modalType: string, options?: Partial<Omit<IModalState, 'modalType'>>) => {
        setModalState({ ...options, modalType, isOpen: true });
    };

    const closeModal = () => {
        setModalState({ isOpen: false });
    };

    const setIsOpen = (isOpen: boolean) => {
        setModalState({ ...modalState, isOpen });
    };

    // Map of modal types to components
    const modalComponents: Record<string, JSX.Element | null> = {
        launchCampaign: <CalendarModal />,
        // initializeCampaign: <SingleQuestionModal modalType="initializeCampaign" />,
        // createSmartContract: <SingleQuestionModal modalType="createSmartContract" />,
        // publishSmartContract: <SingleQuestionModal modalType="publishSmartContract" />,
        // withdrawTokens: <SingleQuestionModal modalType="withdrawTokens" />,
        // collect: <SingleQuestionModal modalType="collect" />,
        // validateFundraisingStatus: <SingleQuestionModal modalType="validateFundraisingStatus" />,
        // manageCampaign: <ManageCampaignModal id={modalState.campaign_id!} />,
        // sendReport: <SendReport campaign={modalState.campaign} />,
        // viewReport: <ViewReportModal id={modalState.campaign_id!} />,
        // viewReportMilestone: <ViewReportMilestone submission={modalState.submission} />,
        // contactSupport: <ContactSupportModal />,
        walletSelector: <WalletSelectorModal />,
        walletInformation: <WalletInformationModal />,
        // successAction: <SuccessAction />,
    };

    return (
        <>
            <ModalContext.Provider value={{ ...modalState, openModal, closeModal, setIsOpen }}>
                {modalState.modalType !== undefined && (
                    <ModalTemplate isOpen={modalState.isOpen} setIsOpen={setIsOpen}>
                        {modalComponents[modalState.modalType] || undefined}
                    </ModalTemplate>
                )}
                {children}
            </ModalContext.Provider>
        </>
    );
};
