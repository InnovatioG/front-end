import { createContext, useContext, useState } from 'react';
import { useModalStore } from '@/store/modal/useModalStoreState';
import ModalTemplate from '@/components/modal/Modal';
import InitializeCampaignModal from '@/components/modal/InitializeCampaignModal';
import ManageCampaignModal from '@/components/modal/ManageCampaignModal';
import SendReportMilestone from '@/components/modal/SendReport';
import ContactSupportModal from '@/components/modal/ContactSupportModal';
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
  const { openModal: openModalFromStore, closeModal: closeModalFromStore, modalType: modalTypeToStore, campaignId } = useModalStore();
  const [modalType, setModalType] = useState<ModalType | null>(null);

  console.log(modalTypeToStore)
  const openModal = (type: ModalType) => setModalType(type);
  const closeModal = () => setModalType(null);

  return (
    <ModalContext.Provider value={{ openModal, closeModal, modalType }}>
      {modalTypeToStore && (
        <ModalTemplate isOpen={modalTypeToStore !== null} setIsOpen={closeModalFromStore}>
          {modalTypeToStore === 'initializeCampaign' && <InitializeCampaignModal />}
          {modalTypeToStore === "manageCampaign" && <ManageCampaignModal id={campaignId} />}
          {modalTypeToStore === 'sendReport' && <SendReportMilestone />}
          {modalTypeToStore === 'contactSupport' && <ContactSupportModal />}
        </ModalTemplate>
      )}
      {children}
    </ModalContext.Provider>
  );
};