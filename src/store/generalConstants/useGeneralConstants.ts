import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import axios from 'axios';
import type { CampaignCategory, CampaignStatusGlobal, MilestoneStatusGlobal } from '@/HardCode/databaseType';

interface GeneralStore {
    campaignCategories: CampaignCategory[];
    campaignStatus: CampaignStatusGlobal[];
    milestoneStatus: MilestoneStatusGlobal[];
    adaPrice: number;
    setCampaignCategories: (categories: CampaignCategory[]) => void;
    setCampaignStatus: (statuses: CampaignStatusGlobal[]) => void;
    setMilestoneStatus: (statuses: MilestoneStatusGlobal[]) => void;
    setAdaPrice: (price: number) => void;
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
        setAdaPrice: (price) => {
            set((state) => {
                state.adaPrice = price;
            });
        },
    }))
);
