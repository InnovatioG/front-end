import { ModalEnums } from '@/utils/constants/constants';
import { createContext, ReactNode, useContext } from 'react';

export interface IModalContext  {
    activeModal: ModalEnums | null;
    modalData?: Record<string, any> ;
    openModal: (modal: ModalEnums, data?: Record<string, any>, component?: ReactNode) => void;
    closeModal: () => void;
}

export const ModalContext = createContext<IModalContext | undefined>(undefined);

export const useModal = () => {
    const context = useContext(ModalContext);
    if (context === undefined) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};
