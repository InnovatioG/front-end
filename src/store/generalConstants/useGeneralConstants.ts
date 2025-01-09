import type { CampaignCategory, CampaignStatusGlobal, MilestoneStatusGlobal } from '@/HardCode/databaseType';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface GeneralStore {
    campaignCategories: CampaignCategory[];
    campaignStatus: CampaignStatusGlobal[];
    milestoneStatus: MilestoneStatusGlobal[];
    setCampaignCategories: (categories: CampaignCategory[]) => void;
    setCampaignStatus: (statuses: CampaignStatusGlobal[]) => void;
    setMilestoneStatus: (statuses: MilestoneStatusGlobal[]) => void;
}

export const useGeneralStore = create<GeneralStore>()(
    immer((set) => ({
        campaignCategories: [],
        campaignStatus: [],
        milestoneStatus: [],
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
    }))
);
