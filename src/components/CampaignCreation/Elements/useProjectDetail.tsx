import React from 'react';
import { useEffect, useState } from "react"
import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';
import { CampaignContent } from '@/types/types';
import { initialTextEditorOptions } from '@/utils/constants';
import type { initialTextEditorOptionsType } from '@/types/types';


export const useCampaignDetail = () => {
    const { campaign, setCampaign } = useCampaignIdStore();
    const { campaign_content = [] } = campaign || {};
    const [campaignContentState, setCampaignContentState] = useState<CampaignContent[]>(campaign_content);
    const [selectedOption, setSelectedOption] = useState<CampaignContent | null>(null);
    const [newOptionTitle, setNewOptionTitle] = useState('');
    const [loading, setLoading] = useState(true);



    /* Handle option selection */
    const handleSelectClick = (index: number) => {
        setSelectedOption(mergedOptions[index]);
    };



    /* Merge user options with default options */
    const mergeOptions = (campaign_content: CampaignContent[], initialTextEditorOptions: initialTextEditorOptionsType[]) => {
        const maxUserOrder = campaign_content?.reduce(
            (max, item) => Math.max(max, item.order ?? 0),
            0
        ) || 0;

        const defaultOptionsMap = new Map(
            initialTextEditorOptions.map((option) => [option.name, option])
        );

        const merged = campaign_content.map((option) => ({
            ...defaultOptionsMap.get(option.name!),
            ...option,
        }));

        const remainingDefaults = initialTextEditorOptions
            .filter((option) => !campaign_content.some((item) => item.name === option.name))
            .map((option, index) => ({
                ...option,
                order: maxUserOrder + index + 1,
            }));

        return [...merged, ...remainingDefaults].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    };

    const mergedOptions = mergeOptions(campaignContentState, initialTextEditorOptions);


    /* Handle add option */
    const handleAddOption = () => {
        if (newOptionTitle.trim() === '') return;

        const newOption: CampaignContent = {
            name: newOptionTitle,
            description: '',
            order: campaignContentState.length + 1,
        };

        const updatedContent = [...campaignContentState, newOption];
        setCampaignContentState(updatedContent);
        setSelectedOption(newOption);
        setNewOptionTitle('');
    };


    /* Handle description change */
    const handleDescriptionChange = (content: string) => {
        if (!selectedOption) return;

        const updatedCampaignContent = campaign.campaign_content?.map((item) => {
            if (item.order === selectedOption.order) {
                return {
                    ...item,
                    description: content,
                };
            }
            return item;
        });
        setCampaign({
            ...campaign,
            campaign_content: updatedCampaignContent,
        });
    };
    useEffect(() => {
        if (campaign) {
            setLoading(false);
        }
    }, [campaign]);



    return {
        loading,
        mergedOptions,
        handleSelectClick,
        selectedOption,
        newOptionTitle,
        setNewOptionTitle,
        handleAddOption,
        setSelectedOption,
        handleDescriptionChange
    };
};