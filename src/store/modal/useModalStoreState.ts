import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface ModalState {
    modalType: string | null;
    campaignId: number | null;
}

interface ModalStore extends ModalState {
    openModal: (modalType: string, campaignId: number) => void;
    closeModal: () => void;
}

export const useModalStore = create<ModalStore>()(
    immer<ModalStore>((set) => ({
        modalType: null,
        campaignId: null,
        openModal: (modalType, campaignId) =>
            set((state) => {
                state.modalType = modalType;
                state.campaignId = campaignId;
            }),
        closeModal: () =>
            set((state) => {
                state.modalType = null;
                state.campaignId = null;
            }),
    }))
);
