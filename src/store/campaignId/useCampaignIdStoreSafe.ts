import { CampaignEX } from '@/types/types';
import { ICampaignIdStore, useCampaignIdStore } from './useCampaignIdStore';
import { useEffect } from 'react';

export interface ICampaignIdStoreSafe extends ICampaignIdStore {
    campaign: CampaignEX;
}

export const useCampaignIdStoreSafe = (): ICampaignIdStoreSafe => {
    const { campaign, ...rest } = useCampaignIdStore();

    // useEffect(() => {
    //     alert(campaign?.campaign.featured);
    // }, [campaign?.campaign.featured]);

    if (!campaign) {
        throw new Error('Campaign is undefined but expected to be defined.');
    }

    return { campaign, ...rest };
};
