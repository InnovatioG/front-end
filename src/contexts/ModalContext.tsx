import CalendarModal from '@/components/UI/Modal/CalendarModal';
import ContactSupportModal from '@/components/UI/Modal/ContactSupportModal';
import SingleQuestionModal from '@/components/UI/Modal/InitializeCampaignModal';
import ManageCampaignModal from '@/components/UI/Modal/ManageCampaignModal';
import ModalTemplate from '@/components/UI/Modal/ModalTemplate';
import SendReport from '@/components/UI/Modal/SendReport';
import ViewReportMilestone from '@/components/UI/Modal/ViewReportMilestone';
import ViewReportModal from '@/components/UI/Modal/ViewReportModal';
import WalletInformationModal from '@/components/UI/Modal/WalletInformation';
import { WalletSelectorModal } from '@/components/UI/Modal/WalletSelectorModal';
import type { Campaign } from '@/types/types';
import { createContext, useContext, useState } from 'react';
import SuccessAction from '@/components/UI/Modal/SuccesAction';
interface ModalState {
    isOpen: boolean;
    modalType?: string;
    campaign_id?: string;
    campaign?: Campaign;
    submission?: string;
}

interface ModalContextType extends ModalState {
    openModal: (modalType: string, options?: Partial<Omit<ModalState, 'modalType'>>) => void;
    closeModal: () => void;
    setIsOpen: (isOpen: boolean) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
    const context = useContext(ModalContext);
    if (context === undefined) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [modalState, setModalState] = useState<ModalState>({ isOpen: false });

    const openModal = (modalType: string, options?: Partial<Omit<ModalState, 'modalType'>>) => {
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
        initializeCampaign: <SingleQuestionModal modalType="initializeCampaign" />,
        createSmartContract: <SingleQuestionModal modalType="createSmartContract" />,
        publishSmartContract: <SingleQuestionModal modalType="publishSmartContract" />,
        withdrawTokens: <SingleQuestionModal modalType="withdrawTokens" />,
        collect: <SingleQuestionModal modalType="collect" />,
        validateFundraisingStatus: <SingleQuestionModal modalType="validateFundraisingStatus" />,
        manageCampaign: <ManageCampaignModal id={modalState.campaign_id!} />,
        sendReport: <SendReport campaign={modalState.campaign} />,
        viewReport: <ViewReportModal id={modalState.campaign_id!} />,
        viewReportMilestone: <ViewReportMilestone submission={modalState.submission} />,
        contactSupport: <ContactSupportModal />,
        walletSelector: <WalletSelectorModal />,
        walletInformation: <WalletInformationModal />,
        successAction: <SuccessAction />,
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
