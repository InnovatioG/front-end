import type { CampaignCategory, CampaignStatusGlobal, MilestoneStatusGlobal } from '@/types/types';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface GeneralStore {
    campaignCategories: CampaignCategory[];
    campaignStatus: CampaignStatusGlobal[];
    milestoneStatus: MilestoneStatusGlobal[];
    adaPrice: number;
    setCampaignCategories: (categories: CampaignCategory[]) => void;
    setCampaignStatus: (statuses: CampaignStatusGlobal[]) => void;
    setMilestoneStatus: (statuses: MilestoneStatusGlobal[]) => void;
    setADAPrice: (price: number) => void;
}

export const useGeneralStore = create<GeneralStore>()(
    immer((set) => ({
        campaignCategories: [],
        campaignStatus: [],
        milestoneStatus: [],
        adaPrice: 0,
        setCampaignCategories: (categories) => {
            set((state) => {
                state.campaignCategories = categories;
            });
        },
        setCampaignStatus: (statuses) => {
            set((state) => {
                state.campaignStatus = statuses;
            });
        },
        setMilestoneStatus: (statuses) => {
            set((state) => {
                state.milestoneStatus = statuses;
            });
        },
        setADAPrice: (price) => {
            set((state) => {
                state.adaPrice = price;
            });
        },
    }))
);
