import { useState, useEffect } from 'react';
import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';
import { useRouter } from 'next/router';
import { CampaignEntity } from '@/lib/SmartDB/Entities';
import { CampaignApi } from '@/lib/SmartDB/FrontEnd';
import { transformToBaseCampaign } from '@/utils/transformBaseCampaign';
const useInvestPage = () => {
    const { setCampaign, campaign, setIsLoading, isLoading, setMenuView, setEditionMode } = useCampaignIdStore();


    console.log(campaign)

    const router = useRouter();
    const { id } = router.query;

    console.log(id)

    const fetchCampaign = async () => {
        setIsLoading(true);
        if (id) {
            try {
                const campaign_id = Number(id);
                const campaign = await CampaignApi.getByIdApi_(String(campaign_id));
                console.log(campaign)
                if (campaign) {
                    setCampaign(campaign);
                } else {
                    console.error('Campaign is undefined');
                }
            } catch (error) {
                console.error('Error fetching campaign:', error);
            }
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (id) {
            fetchCampaign();
        }
    }, [id]);

    return {
        fetchCampaign,
        campaign,
    };
};

export default useInvestPage;
