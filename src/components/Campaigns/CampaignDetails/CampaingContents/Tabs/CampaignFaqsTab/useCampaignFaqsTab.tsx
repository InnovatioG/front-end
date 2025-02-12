import { ICampaignDetails } from '@/hooks/useCampaingDetails';
import { CampaignFaqsEntity } from '@/lib/SmartDB/Entities';
import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import React, { useState } from 'react';

interface InputFAQ {
    question: string;
    answer: string;
    order: number;
}

const CampaignFaqsTab = (props: ICampaignIdStoreSafe & ICampaignDetails) => {
    const { campaign, setCampaignEX } = props;
    const faqs = campaign.faqs || []; // Ensure faqs is always an array
    const [isOpen, setIsOpen] = useState(false);

    const getNextOrder = () => {
        return faqs.length > 0 ? Math.max(...faqs.map((faq) => faq.order)) + 1 : 1;
    };

    const [newQa, setNewQa] = useState<InputFAQ>({ question: '', answer: '', order: getNextOrder() });

    const handleNewQa = () => {
        const newFaq = new CampaignFaqsEntity(newQa);
        newFaq.campaign_id = campaign.campaign._DB_id;
        setCampaignEX({
            ...campaign,
            faqs: [...faqs, newFaq],
        });
        setNewQa({ question: '', answer: '', order: getNextOrder() });
        setIsOpen(false);
    };

    const handleQuestionOpen = () => {
        setIsOpen(!isOpen);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewQa((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleRemoveQa = (index: number) => {
        const deletedItems = faqs[index]._DB_id === undefined ? [...(campaign.faqs_deleted || [])] : [...(campaign.faqs_deleted || []), faqs[index]];
        const newFaqs = faqs.filter((_, i) => i !== index);
        setCampaignEX({
            ...campaign,
            faqs: newFaqs,
            faqs_deleted: deletedItems,
        });
    };

    return {
        faqs,
        isOpen,
        newQa,
        handleNewQa,
        handleQuestionOpen,
        handleChange,
        handleRemoveQa,
        setIsOpen,
    };
};

export default CampaignFaqsTab;
