import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Campaign } from '@/HardCode/databaseType';

interface ModalState {
    modalType: string | null;
    campaignId: number | null;
    campaign?: Campaign;
}

interface ModalStore extends ModalState {
    openModal: (modalType: string, campaignId: number, campaign?: Campaign) => void;
    closeModal: () => void;
}

export const useModalStore = create<ModalStore>()(
    immer<ModalStore>((set) => ({
        modalType: null,
        campaignId: null,
        campaign: undefined,
        openModal: (modalType, campaignId, campaign) =>
            set((state) => {
                state.modalType = modalType;
                state.campaignId = campaignId;
                state.campaign = campaign;
            }),
        closeModal: () =>
            set((state) => {
                state.modalType = null;
                state.campaignId = null;
            }),
    }))
);
