import { createContext, useContext, useState } from 'react';

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
  const [modalType, setModalType] = useState<ModalType | null>(null);

  const openModal = (type: ModalType) => setModalType(type);
  const closeModal = () => setModalType(null);

  return (
    <ModalContext.Provider value={{ openModal, closeModal, modalType }}>
      {children}
    </ModalContext.Provider>
  );
};