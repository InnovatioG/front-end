import { createContext, useContext, useState } from 'react';
import { useModalStore } from '@/store/modal/useModalStoreState';
import ModalTemplate from '@/components/modal/Modal';
import SingleQuestionModal from '@/components/modal/InitializeCampaignModal';
import ManageCampaignModal from '@/components/modal/ManageCampaignModal';
import SendReport from '@/components/modal/SendReport';
import ContactSupportModal from '@/components/modal/ContactSupportModal';
import ViewReportModal from '@/components/modal/ViewReportModal';
import WalletInformationModal from '@/components/modal/WalletInformation';
import CalendarModal from '@/components/modal/CalendarModal';

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
  const { openModal: openModalFromStore, closeModal: closeModalFromStore, modalType: modalTypeToStore, campaignId, campaign } = useModalStore();
  const [modalType, setModalType] = useState<ModalType | null>(null);

  const openModal = (type: ModalType) => setModalType(type);
  const closeModal = () => setModalType(null);

  // Map of modal types to components
  const modalComponents: Record<string, JSX.Element | null> = {
    launchCampaign: <CalendarModal />,
    initializeCampaign: <SingleQuestionModal modalType="initializeCampaign" />,
    createSmartContract: <SingleQuestionModal modalType="createSmartContract" />,
    publishSmartContract: <SingleQuestionModal modalType="publishSmartContract" />,
    validateFundraisingStatus: <SingleQuestionModal modalType="validateFundraisingStatus" />,
    manageCampaign: <ManageCampaignModal id={campaignId} />,
    sendReport: <SendReport campaign={campaign} />,
    viewReport: <ViewReportModal id={campaignId} />,
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