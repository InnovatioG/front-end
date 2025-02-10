import { CampaignEX } from '@/types/types';
import { ICampaignIdStore, useCampaignIdStore } from './useCampaignIdStore';

export interface ICampaignIdStoreSafe extends ICampaignIdStore {
    campaign: CampaignEX 
}

export const useCampaignIdStoreSafe = () : ICampaignIdStoreSafe => {
    const { campaign, ...rest } = useCampaignIdStore();

    if (!campaign) {
        throw new Error('Campaign is undefined but expected to be defined.');
    }

    return { campaign, ...rest };
};