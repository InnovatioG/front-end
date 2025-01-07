import { createContext, useContext, useEffect, useState } from 'react';
import ModalTemplate from '@/components/modal/ModalTemplate';
import SingleQuestionModal from '@/components/modal/InitializeCampaignModal';
import ManageCampaignModal from '@/components/modal/ManageCampaignModal';
import SendReport from '@/components/modal/SendReport';
import ContactSupportModal from '@/components/modal/ContactSupportModal';
import ViewReportModal from '@/components/modal/ViewReportModal';
import WalletInformationModal from '@/components/modal/WalletInformation';
import CalendarModal from '@/components/modal/CalendarModal';
import ViewReportMilestone from '@/components/modal/ViewReportMilestone';
import { WalletSelectorModal } from '@/components/modal/WalletSelectorModal';
import type { Campaign } from '@/HardCode/databaseType';

interface ModalState {
    isOpen: boolean;
    modalType?: string;
    campaign_id?: number;
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
    const [modalState, setModalState] = useState<ModalState>({isOpen: false});

    const openModal = (modalType: string, options?: Partial<Omit<ModalState, 'modalType'>>) => {
        setModalState({ ...options, modalType, isOpen: true,  });
    };

    const closeModal = () => {
        setModalState({ isOpen: false });
    };

    const setIsOpen = (isOpen: boolean) => {
        setModalState({ ...modalState, isOpen});
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
    };

    return (
        <>
            <ModalContext.Provider value={{ ...modalState, openModal, closeModal, setIsOpen }}>
                {modalState.modalType!== undefined && (
                    <ModalTemplate isOpen={modalState.isOpen} setIsOpen={setIsOpen}>
                        {modalComponents[modalState.modalType] || undefined}
                    </ModalTemplate>
                )}
                {children}
            </ModalContext.Provider>
        </>
    );
};
