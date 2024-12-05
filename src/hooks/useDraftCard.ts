import { useState, useEffect } from 'react';
import { Campaign } from '@/HardCode/databaseType';
import { CardInformationByState, cardInformationForProtocolTeam } from '@/utils/constants';
import { formatTime, getTimeRemaining } from '@/utils/formats';

const getMilestoneStatusId = (campaign: Campaign): number | undefined => {
    const milestoneStatusMap: { [key: string]: any } = {
        2: campaign.milestones.find((milestone) => milestone.milestone_status?.milestone_submission?.milestone_status_id === 2),
        3: campaign.milestones.find((milestone) => milestone.milestone_status?.milestone_submission?.milestone_status_id === 3),
        4: campaign.milestones.find((milestone) => milestone.milestone_status?.milestone_submission?.milestone_status_id === 4),
        5: campaign.milestones.find((milestone) => milestone.milestone_status?.milestone_submission?.milestone_status_id === 5),
    };

    return Object.keys(milestoneStatusMap).find((key) => milestoneStatusMap[key]) as number | undefined;
};

const useDraftCard = (campaign: Campaign, isProtocolTeam: boolean) => {
    const milestoneStatusId = getMilestoneStatusId(campaign);

    const { label, buttons } = isProtocolTeam ? cardInformationForProtocolTeam(campaign.state_id) : CardInformationByState(campaign.state_id, milestoneStatusId);

    const labelClass = label.toLowerCase().replace(/\s+/g, '-');

    const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining(campaign.start_date));

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeRemaining(getTimeRemaining(campaign.start_date));
        }, 1000);

        return () => clearInterval(timer);
    }, [campaign.start_date]);

    const formatAllTime = (timeRemaining: any) => {
        return `${timeRemaining.days}:${formatTime(timeRemaining.totalHours)}:${formatTime(timeRemaining.minutes)}`;
    };

    return {
        label,
        labelClass,
        buttons,
        timeRemaining,
        formatAllTime,
    };
};

export default useDraftCard;
