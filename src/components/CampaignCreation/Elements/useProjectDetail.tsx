import React from 'react';
import { useEffect, useState } from "react"
import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';
import { CampaignContent } from '@/types/types';




export const useCampaignDetail = () => {
    const { campaign } = useCampaignIdStore()
    const { campaign_content } = campaign
    console.log(campaign_content)
    const [selectedOption, setSelectedOption] = useState<CampaignContent | null>();

    console.log(selectedOption)




    const handleSelectClick = (index: number) => {
        setSelectedOption(campaign_content && campaign_content[index]);
    };

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (campaign) {
            setLoading(false)
        }
    }, [campaign])

    return {
        loading,
        error,
        campaign_content,
        handleSelectClick,
        selectedOption
    }

}
