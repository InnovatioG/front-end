import { ICampaignDetails } from '@/hooks/useCampaingDetails';
import { CampaignFaqsEntity } from '@/lib/SmartDB/Entities';
import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import React, { useMemo, useState } from 'react';
import { DropResult } from 'react-beautiful-dnd';

interface InputFAQ {
    question: string;
    answer: string;
}

const useCampaignFaqsTab = (props: ICampaignIdStoreSafe & ICampaignDetails) => {
    const { campaign, setCampaignEX } = props;
    const faqs = useMemo(() => [...(campaign.faqs ?? [])].sort((a, b) => a.order - b.order), [campaign]);
    const [isOpenAddMore, setIsOpenAddMore] = useState(false);

    const [newQa, setNewQa] = useState<InputFAQ>({ question: '', answer: '' });

    const handleNewQa = () => {
        const newFaq = new CampaignFaqsEntity(newQa);
        newFaq.campaign_id = campaign.campaign._DB_id;

        let order = 1;
        const reorderedFaqs = [...faqs, newFaq].map((faq) => {
            faq.order = order++;
            return faq;
        });

        setCampaignEX({
            ...campaign,
            faqs: reorderedFaqs,
        });
        setNewQa({ question: '', answer: '' });
        setIsOpenAddMore(false);
    };

    const handleQuestionOpen = () => {
        setIsOpenAddMore(!isOpenAddMore);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewQa((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleRemoveQa = (index: number) => {

        const confirm = window.confirm('Are you sure you want to delete this faqs?');
        if (!confirm) return;

        const deletedItems = faqs[index]._DB_id === undefined ? [...(campaign.faqs_deleted || [])] : [...(campaign.faqs_deleted || []), faqs[index]];
        const newFaqs = faqs.filter((_, i) => i !== index);

        let order = 1;
        const reorderedFaqs = newFaqs.map((faq) => {
            faq.order = order++;
            return faq;
        });

        setCampaignEX({
            ...campaign,
            faqs: reorderedFaqs,
            faqs_deleted: deletedItems,
        });
    };

    const handleUpdateOrder = (result: DropResult) => {
        if (!result.destination) return;

        const updatedFaqs = Array.from(faqs);
        const [movedItem] = updatedFaqs.splice(result.source.index, 1);
        updatedFaqs.splice(result.destination.index, 0, movedItem);

        let order = 1;
        const reorderedFaqs = updatedFaqs.map((faq) => {
            faq.order = order++;
            return faq;
        });

        setCampaignEX({
            ...campaign,
            faqs: reorderedFaqs,
        });
    };

    return {
        faqs,
        isOpenAddMore,
        newQa,
        handleNewQa,
        handleQuestionOpen,
        handleChange,
        handleRemoveQa,
        setIsOpenAddMore,
        handleUpdateOrder,
    };
};

export default useCampaignFaqsTab;
