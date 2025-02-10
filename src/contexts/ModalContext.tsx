import type { CampaignEX } from '@/types/types';
import { createContext, useContext } from 'react';

export interface IModalState {
    isOpen: boolean;
    modalType?: string;
    campaign_id?: string;
    campaign?: CampaignEX;
    submission?: string;
}

export interface IModalContext extends IModalState {
    openModal: (modalType: string, options?: Partial<Omit<IModalState, 'modalType'>>) => void;
    closeModal: () => void;
    setIsOpen: (isOpen: boolean) => void;
}

export const ModalContext = createContext<IModalContext | undefined>(undefined);

export const useModal = () => {
    const context = useContext(ModalContext);
    if (context === undefined) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};
