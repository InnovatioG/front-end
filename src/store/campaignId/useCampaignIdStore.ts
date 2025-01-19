import { CampaignIdStore, initialState } from '@/store/campaignId/initialState';
import { parse } from 'path';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

/* Campaign render */

interface useCampaignIdStore extends CampaignIdStore {
    setCampaign: (campaign: CampaignIdStore['campaign']) => void;
    setMenuView: (menuView: CampaignIdStore['menuView']) => void;
    setMilestone: (milestone: CampaignIdStore['milestone']) => void;
    setIsLoading: (isLoading: boolean) => void;
    setIsAdmin: (isAdmin: boolean) => void;
    setIsProtocolTeam: (isProtocolTeam: boolean) => void;
    setError: (error: string) => void;
    setEditionMode: (editionMode: boolean) => void;
    /*     getGoalInCurrentCurrency: () => number;
     */
}

export const useCampaignIdStore = create<useCampaignIdStore>()(
    immer<useCampaignIdStore>((set, get) => ({
        ...initialState,

        setCampaign: (campaign) =>
            set((state) => {
                state.campaign = {
                    ...campaign,
                    milestones: campaign.milestones ? [...campaign.milestones].sort((a, b) => parseInt(a._DB_id ?? '0') - parseInt(b._DB_id ?? '0')) : [],
                };
            }),

        setIsLoading: (isLoading) =>
            set((state) => {
                state.isLoading = isLoading;
            }),
        setIsAdmin: (isAdmin) =>
            set((state) => {
                state.isAdmin = isAdmin;
            }),
        setIsProtocolTeam: (isProtocolTeam) =>
            set((state) => {
                state.isProtocolTeam = isProtocolTeam;
            }),
        setMenuView: (menuView) =>
            set((state) => {
                state.menuView = menuView;
            }),
        setError: (error) =>
            set((state) => {
                state.error = error;
            }),
        setMilestone: (milestone) =>
            set((state) => {
                state.milestone = milestone;
            }),
        setEditionMode: (editionMode) =>
            set((state) => {
                state.editionMode = editionMode;
            }),

        /*         getGoalInCurrentCurrency: () => {
            const { priceAdaOrDollar } = usePriceStore.getState();
            const { campaign } = get();
            return priceAdaOrDollar === 'dollar' ? campaign.requestMaxAda : campaign.requestMaxAda / price_ada;
        }, */
    }))
);
