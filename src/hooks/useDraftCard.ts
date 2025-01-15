import { Campaign } from '@/types/types';
import { CardInformationByState, cardInformationForProtocolTeam } from '@/utils/constants';
import { formatTime, getTimeRemaining } from '@/utils/formats';
import { useEffect, useState } from 'react';
import { CampaignStatus } from '@/utils/constants/status';
import { useGeneralStore } from '@/store/generalConstants/useGeneralConstants';

const getmilestone_status_id = (campaign: Campaign): number | undefined => {
    const milestoneStatusMap: { [key: string]: any } = campaign.milestones
        ? {
              2: campaign.milestones.find((milestone) => milestone.milestone_status_id === '2'),
              3: campaign.milestones.find((milestone) => milestone.milestone_status_id === '3'),
              4: campaign.milestones.find((milestone) => milestone.milestone_status_id === '4'),
              5: campaign.milestones.find((milestone) => milestone.milestone_status_id === '5'),
          }
        : {};

    return Object.keys(milestoneStatusMap).find((key) => milestoneStatusMap[key]) as number | undefined;
};

/* TODO PREGUNTAR LO DEL MILESTONE STATUS INTERMEDIO (APPROVED) */

const getCurrentMilestone = (campaign: Campaign): string => {
    if (campaign.milestones === undefined) return '';
    for (let i = 0; i < campaign.milestones.length; i++) {
        const milestone = campaign.milestones[i];
        const statusId = milestone.milestone_status_id;
        if (statusId === '5') {
            const nextMilestone = campaign.milestones[i + 1];
            const nextStatusId = nextMilestone?.milestone_status_id;
            if (nextStatusId === '2' || nextStatusId === '3' || nextStatusId === '4' || nextStatusId === '0' || nextStatusId === '6') {
                return `M${i + 2}`;
            }
        }

        if (statusId === '1') {
            return `M${i}`;
        }

        if (statusId === '2' || statusId === '3' || statusId === '4' || statusId === '6') {
            return `M${i + 1}`;
        }
    }
    return '';
};

const useDraftCard = (campaign: Campaign, isProtocolTeam: boolean, isAdmin: boolean) => {
    const milestone_status_id = getmilestone_status_id(campaign);
    const currentMilestone = getCurrentMilestone(campaign);
    const { campaignStatus } = useGeneralStore();
    const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining(campaign.begin_at));

    const getInternalId = (campaignStatusId: string | undefined): number | undefined => {
        const status = campaignStatus.find((status) => status.id === campaignStatusId);
        return status?.id_internal;
    };

    const idInternal = getInternalId(campaign.campaign_status_id);

    const { label, buttons } = isProtocolTeam
        ? cardInformationForProtocolTeam(Number(campaign.campaign_status_id))
        : CardInformationByState(Number(idInternal), milestone_status_id, isAdmin);

    const labelClass = label.toLowerCase().replace(/\s+/g, '-');

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeRemaining(getTimeRemaining(campaign.begin_at));
        }, 1000);

        return () => clearInterval(timer);
    }, [campaign.begin_at]);

    const formatAllTime = (timeRemaining: any) => {
        if (timeRemaining.days >= 4) {
            return `${timeRemaining.days} days`;
        } else {
            return `${formatTime(timeRemaining.totalHours)}:${formatTime(timeRemaining.minutes)}: ${formatTime(timeRemaining.seconds)}`;
        }
    };

    return {
        label,
        labelClass,
        buttons,
        timeRemaining,
        formatAllTime,
        currentMilestone,
        getInternalId,
    };
};

export default useDraftCard;
