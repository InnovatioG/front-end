import { ProjectDetailState, initialState } from '@/store/projectdetail/initialState';
import axios from 'axios';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { usePriceStore } from '../price/usepriceAdaOrDollar';

interface UseProjectDetailStore extends ProjectDetailState {
    setProject: (project: ProjectDetailState['project']) => void;
    setMenuView: (menuView: ProjectDetailState['menuView']) => void;
    setMilestone: (milestone: ProjectDetailState['milestone']) => void;
    setIsLoading: (isLoading: boolean) => void;
    setIsAdmin: (isAdmin: boolean) => void;
    setIsProtocolTeam: (isProtocolTeam: boolean) => void;
    setError: (error: string) => void;
    setEditionMode: (editionMode: boolean) => void;
    fetchAdaPrice: () => void;
    getGoalInCurrentCurrency: () => number;
}

export const useProjectDetailStore = create<UseProjectDetailStore>()(
    immer<UseProjectDetailStore>((set, get) => ({
        ...initialState,

        setProject: (project) =>
            set((state) => {
                state.project = project;
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
        fetchAdaPrice: async () => {
            set((state) => {
                state.isLoadingPrice = true;
            });
            try {
                const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=cardano&vs_currencies=usd');
                set((state) => {
                    state.price_ada = response.data.cardano.usd;
                });
            } catch (error) {
                console.error('Error fetching ADA price:', error);
            } finally {
                set((state) => {
                    state.isLoadingPrice = false;
                });
            }
        },
        getGoalInCurrentCurrency: () => {
            const { priceAdaOrDollar } = usePriceStore.getState();
            const { project, price_ada } = get();
            return priceAdaOrDollar === 'dollar' ? project.goal : project.goal / price_ada;
        },
    }))
);
