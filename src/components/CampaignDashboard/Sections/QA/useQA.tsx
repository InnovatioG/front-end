import React, { useState, useEffect } from 'react';
import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';

const useQA = () => {
    const { campaign, setCampaign } = useCampaignIdStore();
    const faqs = campaign.faqs || []; // Ensure faqs is always an array
    const [viewInputQuestion, setViewInputQuestion] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const [newQa, setNewQa] = useState({ question: '', answer: '', order: 0 });

    const handleNewQa = () => {
        setCampaign({
            ...campaign,
            faqs: [...faqs, newQa],
        });
        setNewQa({ question: '', answer: '', order: faqs.length + 1 });
    };

    const handleQuestionOpen = () => {
        setIsOpen(!isOpen);
        setViewInputQuestion(!viewInputQuestion);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewQa((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleRemoveQa = (index: number) => {
        const newFaqs = faqs.filter((_, i) => i !== index);
        setCampaign({
            ...campaign,
            faqs: newFaqs,
        });
    };

    return {
        faqs,
        viewInputQuestion,
        isOpen,
        newQa,
        handleNewQa,
        handleQuestionOpen,
        handleChange,
        handleRemoveQa,
        setIsOpen,
    };
};

export default useQA;
