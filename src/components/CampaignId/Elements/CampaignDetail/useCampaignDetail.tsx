import React, { useEffect, useState } from "react";
import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';
import { CampaignContent } from '@/types/types';
import { initialTextEditorOptions } from '@/utils/constants';
import type { initialTextEditorOptionsType } from '@/types/types';
import { postCampaignContent, updateCampaignContent, deleteCampaignContentInformation } from "@/components/CampaignId/Services/CampaignContent";
import { useModal } from "@/contexts/ModalContext";
export const useCampaignDetail = () => {
    const { campaign, setCampaign } = useCampaignIdStore();
    const { campaign_content = [] } = campaign || {};
    const { _DB_id } = campaign || {};
    const [campaignContentState, setCampaignContentState] = useState<CampaignContent[]>(campaign_content);
    const [selectedOption, setSelectedOption] = useState<CampaignContent | null>(null);
    const [newOptionTitle, setNewOptionTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [viewOptions, setViewOptions] = useState(false);
    const { openModal } = useModal();

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
        const updatedOption = { ...selectedOption, description: content };
        setSelectedOption(updatedOption);

        const updatedCampaignContent = campaignContentState.map((item) =>
            item.order === selectedOption.order ? { ...item, description: content } : item
        );
        setCampaignContentState(updatedCampaignContent);
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

    const handleSaveContent = async () => {
        try {
            const contentsToUpdate = campaignContentState.filter(content => content._DB_id);
            const contentsToCreate = campaignContentState.filter(content => !content._DB_id);
            console.log(contentsToUpdate, contentsToCreate)

            await Promise.all([
                updateCampaignContent(contentsToUpdate),
                postCampaignContent(contentsToCreate, _DB_id)
            ]);

            openModal('successAction');


        } catch (error) {
            console.error('Error al guardar el contenido de la campaña:', error);
        }
    };

    const handleDeleteButton = async (contentId: string) => {
        try {
            await deleteCampaignContentInformation(contentId);
            // Actualiza el estado local después de eliminar el contenido
            const updatedCampaignContent = campaignContentState.filter(content => content._DB_id !== contentId);
            setCampaignContentState(updatedCampaignContent);
            setCampaign({
                ...campaign,
                campaign_content: updatedCampaignContent,
            });
            // Si el contenido eliminado era el seleccionado, deselecciona
            if (selectedOption && selectedOption._DB_id === contentId) {
                setSelectedOption(null);
            }
        } catch (error) {
            console.error('Error al borrar el contenido de la campaña:', error);
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
        handleSaveContent,
        handleDeleteButton
    };
};