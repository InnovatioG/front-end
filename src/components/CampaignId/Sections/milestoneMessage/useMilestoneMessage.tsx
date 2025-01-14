
import { useState, useEffect } from 'react';
import type { Milestone } from '@/types/types';
import { useModal } from '@/contexts/ModalContext';
import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';

export default function useMilestoneMessage({ milestone }: { milestone: Milestone }) {
    const [messageType, setMessageType] = useState('');

    const { estimate_delivery_date } = milestone
    const lastSubmission = milestone.milestone_submissions?.slice(-1)[0];
    const { openModal } = useModal();
    const { campaign } = useCampaignIdStore();




    const handleSendToRevision = () => {
        openModal('sendReport', { campaign_id: campaign._DB_id, campaign });
    };

    useEffect(() => {
        if (estimate_delivery_date) {
            const today = new Date();
            console.log(today)
            console.log(estimate_delivery_date.getTime())
            const diffTime = estimate_delivery_date.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            console.log(diffDays)
            if (diffDays > 0 && diffDays <= 7) {
                setMessageType('expire');
            } else {
                setMessageType(''); // Asegura que se resetee si no cumple la condición
            }
        }

        if (lastSubmission?.approved_justification) {
            setMessageType('approved');
        }

        if (lastSubmission?.rejected_justification) {
            setMessageType('rejected');
        }
    }, [milestone]);

    return {
        messageType,
        handleSendToRevision,
        lastSubmission

    }
}



