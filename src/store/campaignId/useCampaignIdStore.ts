import { CampaignEntity } from '@/lib/SmartDB/Entities';
import { CampaignApi } from '@/lib/SmartDB/FrontEnd';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { CampaignEX, MilestoneEX } from '@/types/types';
import { cloneCampaignEX, cloneMilestoneEX, getCampaignEX } from '@/utils/campaignHelpers';
import { CampaignTabEnum } from '@/utils/constants/routes';

export interface ICampaignIdStoreProps {
    campaign: CampaignEX | undefined;
    milestoneCurrent: MilestoneEX | undefined;
    isLoading: boolean;
    campaignTab?: CampaignTabEnum;
    error: string;
    isEditMode: boolean;
    isValidEdit: boolean;
}

export const initialState: ICampaignIdStoreProps = {
    campaign: undefined,
    milestoneCurrent: undefined,
    campaignTab: undefined,
    isEditMode: true,
    isLoading: false,
    error: '',
    isValidEdit: true,
};

export interface ICampaignIdStore extends ICampaignIdStoreProps {
    setCampaignEX: (campaignEX: CampaignEX | undefined) => void;
    setCampaign: (campaign: CampaignEntity) => void;
    setMilestoneEX: (milestoneEX: MilestoneEX) => void;
    setCampaignTab: (campaignTab?: CampaignTabEnum) => void;
    setIsEditMode: (isEditMode: boolean) => void;
    setIsLoading: (isLoading: boolean) => void;
    setError: (error: string) => void;
    fetchCampaignById: (id: string) => Promise<CampaignEX | undefined>; // New function
    setIsValidEdit: (isValidEdit: boolean) => void;
}

export const useCampaignIdStore = create<ICampaignIdStore>()(
    immer<ICampaignIdStore>((set, get) => ({
        ...initialState,
        setCampaignEX: (campaignEX) =>
            set((state) => {
                state.campaign = cloneCampaignEX(campaignEX); // Use deep clone helper
            }),

        setCampaign: (campaign) =>
            set((state) => {
                if (state.campaign !== undefined) state.campaign.campaign = new CampaignEntity({ ...campaign });
            }),

        setMilestoneEX: (milestoneEX) =>
            set((state) => {
                state.milestoneCurrent = cloneMilestoneEX(milestoneEX);
            }),

        setIsLoading: (isLoading) =>
            set((state) => {
                state.isLoading = isLoading;
            }),

        setCampaignTab: (campaignTab) =>
            set((state) => {
                state.campaignTab = campaignTab;
            }),
        setError: (error) =>
            set((state) => {
                state.error = error;
            }),
        setIsEditMode: (isEditMode) =>
            set((state) => {
                state.isEditMode = isEditMode;
            }),

        setIsValidEdit: (isValidEdit) =>
            set((state) => {
                state.isValidEdit = isValidEdit;
            }),

        fetchCampaignById: async (id: string) => {
            set((state) => {
                state.isLoading = true;
                state.error = '';
            });

            try {
                const campaignData: CampaignEntity | undefined = await CampaignApi.getByIdApi_(id, { doCallbackAfterLoad: true });
                if (campaignData === undefined) {
                    set((state) => {
                        state.isLoading = false;
                        state.error = 'Campaign not found';
                    });
                    return;
                }
                const campaignEX = await getCampaignEX(campaignData);

                set((state) => {
                    state.campaign = cloneCampaignEX(campaignEX);
                    state.isLoading = false;
                });

                return campaignEX;
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
