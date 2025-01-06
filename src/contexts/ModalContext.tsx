import { createContext, useContext, useState } from 'react';
import { useModalStore } from '@/store/modal/useModalStoreState';
import ModalTemplate from '@/components/ui/modal/Modal';
import SingleQuestionModal from '@/components/ui/modal/InitializeCampaignModal';
import ManageCampaignModal from '@/components/ui/modal/ManageCampaignModal';
import SendReport from '@/components/ui/modal/SendReport';
import ContactSupportModal from '@/components/ui/modal/ContactSupportModal';
import ViewReportModal from '@/components/ui/modal/ViewReportModal';
import WalletInformationModal from '@/components/ui/modal/WalletInformation';
import CalendarModal from '@/components/ui/modal/CalendarModal';
import ViewReportMilestone from '@/components/ui/modal/ViewReportMilestone';
type ModalType = 'walletSelector';

interface ModalContextType {
  openModal: (modalType: ModalType) => void;
  closeModal: () => void;
  modalType: ModalType | null;
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
  const { openModal: openModalFromStore, closeModal: closeModalFromStore, modalType: modalTypeToStore, campaign_id, campaign, submission } = useModalStore();
  const [modalType, setModalType] = useState<ModalType | null>(null);

  const openModal = (type: ModalType) => setModalType(type);
  const closeModal = () => setModalType(null);

  // Map of modal types to components
  const modalComponents: Record<string, JSX.Element | null> = {
    launchCampaign: <CalendarModal />,
    initializeCampaign: <SingleQuestionModal modalType="initializeCampaign" />,
    createSmartContract: <SingleQuestionModal modalType="createSmartContract" />,
    publishSmartContract: <SingleQuestionModal modalType="publishSmartContract" />,
    withdrawTokens: <SingleQuestionModal modalType="withdrawTokens" />,
    collect: <SingleQuestionModal modalType="collect" />,
    validateFundraisingStatus: <SingleQuestionModal modalType="validateFundraisingStatus" />,
    manageCampaign: <ManageCampaignModal id={campaign_id} />,
    sendReport: <SendReport campaign={campaign} />,
    viewReport: <ViewReportModal id={campaign_id} />,
    viewReportMilestone: <ViewReportMilestone submission={submission} />,
    contactSupport: <ContactSupportModal />,

    walletInformation: <WalletInformationModal />,

  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal, modalType }}>
      {modalTypeToStore && (
        <ModalTemplate isOpen={modalTypeToStore !== null} setIsOpen={closeModalFromStore}>
          {modalComponents[modalTypeToStore] || null}
        </ModalTemplate>
      )}
      {children}
    </ModalContext.Provider>
  );
};