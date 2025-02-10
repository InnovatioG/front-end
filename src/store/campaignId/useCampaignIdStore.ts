import { CampaignEntity } from '@/lib/SmartDB/Entities';
import { CampaignApi } from '@/lib/SmartDB/FrontEnd';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { CampaignEX, MilestoneEX } from '@/types/types';
import { getCampaignEX } from '@/hooks/useCampaingDetails';
import { CampaignTab } from '@/utils/constants/routes';

export interface ICampaignIdStoreProps {
    campaign: CampaignEX | undefined;
    milestoneCurrent: MilestoneEX | undefined;
    isLoading: boolean;
    menuView: CampaignTab;
    error: string;
    editionMode: boolean;
    isAdmin: boolean;
    isProtocolTeam: boolean;
}

export const initialState: ICampaignIdStoreProps = {
    campaign: undefined,
    milestoneCurrent: undefined,
    menuView: CampaignTab.DETAILS,
    isLoading: false,
    error: '',
    editionMode: true,
    isAdmin: false,
    isProtocolTeam: false,
};

export interface ICampaignIdStore extends ICampaignIdStoreProps {
    setCampaignEX: (campaign: CampaignEX | undefined) => void;
    setMilestoneEX: (milestone: MilestoneEX) => void;
    setMenuView: (menuView: CampaignTab) => void;
    setIsLoading: (isLoading: boolean) => void;
    setIsAdmin: (isAdmin: boolean) => void;
    setIsProtocolTeam: (isProtocolTeam: boolean) => void;
    setError: (error: string) => void;
    setEditionMode: (editionMode: boolean) => void;
    fetchCampaignById: (id: string) => Promise<void>; // New function
}

export const useCampaignIdStore = create<ICampaignIdStore>()(
    immer<ICampaignIdStore>((set, get) => ({
        ...initialState,

        setCampaignEX: (campaign) =>
            set((state) => {
                state.campaign = campaign;
            }),

        setMilestoneEX: (milestone) =>
            set((state) => {
                state.milestoneCurrent = milestone;
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
        // setMilestone: (milestone) =>
        //     set((state) => {
        //         state.milestone = milestone;
        //     }),
        setEditionMode: (editionMode) =>
            set((state) => {
                state.editionMode = editionMode;
            }),

        fetchCampaignById: async (id: string) => {
            set((state) => {
                state.isLoading = true;
                state.error = '';
            });

            try {
                const campaignData: CampaignEntity | undefined = await CampaignApi.getByIdApi_(id);
                if (campaignData === undefined) {
                    set((state) => {
                        state.isLoading = false;
                        state.error = 'Campaign not found';
                    });
                    return;
                }
                const campaignEX = await getCampaignEX(campaignData);

                set((state) => {
                    state.campaign = campaignEX;
                    state.isLoading = false;
                });
            } catch (error) {
                console.error('Error fetching campaign:', error);
                set((state) => {
                    state.isLoading = false;
                    state.error = 'Error fetching campaign';
                });
            }
        },
    }))
);
