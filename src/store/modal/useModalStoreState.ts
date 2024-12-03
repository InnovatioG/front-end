import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface ModalState {
    modalType: string | null;
}

interface ModalStore extends ModalState {
    openModal: (modalType: string) => void;
    closeModal: () => void;
}

export const useModalStore = create<ModalStore>()(
    immer<ModalStore>((set) => ({
        modalType: null,
        openModal: (modalType) =>
            set((state) => {
                state.modalType = modalType;
            }),
        closeModal: () =>
            set((state) => {
                state.modalType = null;
            }),
    }))
);
