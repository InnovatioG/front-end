import React, { useEffect, useState } from "react";
import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';
import { CampaignContent } from '@/types/types';
import { initialTextEditorOptions } from '@/utils/constants';
import type { initialTextEditorOptionsType } from '@/types/types';
import { updateCampaignContentInformation } from "@/components/CampaignId/Services/CampaignContent";

export const useCampaignDetail = () => {
    const { campaign, setCampaign } = useCampaignIdStore();
    const { campaign_content = [] } = campaign || {};
    const { _DB_id } = campaign || {};
    const [campaignContentState, setCampaignContentState] = useState<CampaignContent[]>(campaign_content);
    const [selectedOption, setSelectedOption] = useState<CampaignContent | null>(null);
    const [newOptionTitle, setNewOptionTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [viewOptions, setViewOptions] = useState(false);

    useEffect(() => {
        if (campaign) {
            setLoading(false);
            if (campaign_content.length === 0) {
                // Si no hay contenido de campaña, selecciona la primera opción predeterminada
                const initialOption = initialTextEditorOptions[0];
                const newOption: CampaignContent = {
                    name: initialOption.name,
                    description: '',
                    order: 1,
                };
                setCampaignContentState([newOption]);
                setSelectedOption(newOption);
                setCampaign({
                    ...campaign,
                    campaign_content: [newOption],
                });
            }
        }
    }, [campaign]);

    /* Handle option selection */
    const handleSelectClick = (index: number) => {
        if (selectedOption) {
            // Guarda la descripción actual antes de cambiar de opción
            const updatedCampaignContent = campaignContentState.map((item) =>
                item.order === selectedOption.order
                    ? { ...item, description: selectedOption.description }
                    : item
            );

            setCampaignContentState(updatedCampaignContent);
            setCampaign({
                ...campaign,
                campaign_content: updatedCampaignContent,
            });
        }

        // Cambia a la nueva opción
        const option = { ...mergedOptions[index] };
        setSelectedOption(option);
    };

    /* Merge user options with default options */
    const mergeOptions = (campaign_content: CampaignContent[], initialTextEditorOptions: initialTextEditorOptionsType[]) => {
        if (!campaign_content || campaign_content.length === 0) {
            return [initialTextEditorOptions[0]];
        }
        const defaultOptionsMap = new Map(initialTextEditorOptions.map((option) => [option.name, option]));

        const merged = campaign_content.map((option) => ({
            ...defaultOptionsMap.get(option.name!),
            ...option,
        }));

        return merged.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
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

    const handleAddOptionMenu = (option: initialTextEditorOptionsType) => {
        const newOption: CampaignContent = {
            name: option.name,
            description: '',
            order: campaignContentState.length + 1,
        };

        const updatedContent = [...campaignContentState, newOption];
        setCampaignContentState(updatedContent);
        setSelectedOption(newOption);
        setViewOptions(false);
    };

    const defaultOptions = initialTextEditorOptions.filter((option) => !campaignContentState.some((item) => item.name === option.name));

    /* Handle description change */
    const handleDescriptionChange = (content: string) => {
        if (!selectedOption) return;
        console.log(content)
        const updatedOption = { ...selectedOption, description: content };
        setSelectedOption(updatedOption);
        console.log(updatedOption)

        const updatedCampaignContent = campaignContentState.map((item) =>
            item.order === selectedOption.order ? { ...item, description: content } : item
        );
        setCampaignContentState(updatedCampaignContent);
        console.log(campaignContentState)
        setCampaign({
            ...campaign,
            campaign_content: updatedCampaignContent,
        });
    };

    console.log(campaign_content)

    useEffect(() => {
        if (campaign) {
            setLoading(false);
        }
    }, [campaign]);

    const handleUpdateSave = async () => {
        try {
            await updateCampaignContentInformation(campaignContentState, _DB_id);
        } catch (error) {
            console.error('Error al actualizar el milestone:', error);
        }
    };

    return {
        handleAddOptionMenu,
        defaultOptions,
        loading,
        mergedOptions,
        handleSelectClick,
        selectedOption,
        newOptionTitle,
        setNewOptionTitle,
        handleAddOption,
        setSelectedOption,
        handleDescriptionChange,
        setViewOptions,
        viewOptions,
        initialTextEditorOptions,
        handleUpdateSave
    };
};