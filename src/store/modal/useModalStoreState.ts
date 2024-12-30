import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Campaign } from '@/HardCode/databaseType';
import { sub } from 'date-fns';

interface ModalState {
    modalType: string | null;
    campaignId: number | null;
    campaign?: Campaign;
    submission?: string;
}

interface ModalStore extends ModalState {
    openModal: (modalType: string, campaignId: number, campaign?: Campaign, submission?: string) => void;
    closeModal: () => void;
}

export const useModalStore = create<ModalStore>()(
    immer<ModalStore>((set) => ({
        modalType: null,
        campaignId: null,
        campaign: undefined,
        submission: undefined,

        /*************  ✨ Codeium Command ⭐  *************/
        /**
         * Opens the modal with the given modalType and campaignId.
         * @param {string} modalType The type of modal to open.
         * @param {number} campaignId The id of the campaign related to the modal.
         * @param {Campaign} [campaign] The campaign object related to the modal.
         */
        /******  5f908fa6-76db-447d-a2a4-a18070152fca  *******/
        openModal: (modalType, campaignId, campaign, submission) =>
            set((state) => {
                state.modalType = modalType;
                state.campaignId = campaignId;
                state.campaign = campaign;
                state.submission = submission;
            }),
        closeModal: () =>
            set((state) => {
                state.modalType = null;
                state.campaignId = null;
                state.campaign = undefined;
                state.submission = undefined;
            }),
    }))
);
