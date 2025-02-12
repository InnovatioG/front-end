import { useState, useEffect } from 'react';
import { useModal } from '@/contexts/ModalContext';
import { MilestoneEX } from '@/types/types';
import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import { ICampaignDetails } from '@/hooks/useCampaingDetails';
import { ModalEnums } from '@/utils/constants/constants';

export interface MilestoneMessageProps {
    milestone: MilestoneEX;
    icon: string;
}

export default function useMilestoneMessage(props: MilestoneMessageProps & ICampaignIdStoreSafe & ICampaignDetails) {
    const { milestone, campaign } = props;

    const [messageType, setMessageType] = useState('');

    const { estimate_delivery_date } = milestone.milestone;
    const lastSubmission = milestone.milestone_submissions?.[0];
    const { openModal } = useModal();

    const handleSendToRevision = () => {
        openModal(ModalEnums.submitMilestone, { campaign_id: campaign.campaign._DB_id, campaign });
    };

    useEffect(() => {
        if (estimate_delivery_date) {
            const today = new Date();
            console.log(today);
            console.log(estimate_delivery_date.getTime());
            const diffTime = estimate_delivery_date.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            console.log(diffDays);
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
    }, [milestone, estimate_delivery_date, lastSubmission]);

    return {
        messageType,
        handleSendToRevision,
        lastSubmission,
    };
}
