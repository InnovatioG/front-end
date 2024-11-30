import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import axios from 'axios';
import { ProjectDetailState, initialState } from '@/store/projectdetail/initialState';

interface UseProjectDetailStore extends ProjectDetailState {
    setProject: /* (project: ProjectDetailState["project"]) => void; */ any;
    setMenuView: /* (menuView: ProjectDetailState["menuView"]) => void */ any;
    setMilestone: (milestone: ProjectDetailState['milestone']) => void;
    setIsLoading: (isLoading: boolean) => void;
    setError: (error: string) => void;
    setEditionMode: (editionMode: boolean) => void;
    fetchAdaPrice: () => void;
}

export const useProjectDetailStore = create<UseProjectDetailStore>()(
    immer<UseProjectDetailStore>((set) => ({
        ...initialState,

        setProject: (project: ProjectDetailState['project']) =>
            set((state) => {
                state.project = project;
            }),
        setIsLoading: (isLoading) =>
            set((state) => {
                state.isLoading = isLoading;
            }),
        setMenuView: (menuView: ProjectDetailState['menuView']) =>
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
    }))
);
