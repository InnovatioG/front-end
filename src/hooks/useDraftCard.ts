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

const getCurrentMilestone = (campaign: Campaign): string => {
    for (let i = 0; i < campaign.milestones.length; i++) {
        const milestone = campaign.milestones[i];
        const statusId = milestone.milestone_status?.milestone_submission?.milestone_status_id;

        /* CHEQUEO SI MI ESTADO ACTUAL ES FINISHED PARA ARRANCAR A ITERAR EL SIGUIENTE MILESTONE */
        if (statusId === 5) {
            const nextMilestone = campaign.milestones[i + 1];
            const nextStatusId = nextMilestone?.milestone_status?.milestone_submission?.milestone_status_id;
            if (nextStatusId === 2 || nextStatusId === 3 || nextStatusId === 4 || nextStatusId === 0 || nextStatusId === 6) {
                return `M${i + 2}`; // M2, M3, etc.
            }
        }

        if (statusId === 2 || statusId === 3 || statusId === 4 || statusId === 6) {
            return `M${i + 1}`; // M2, M3, etc.
        }
    }
    return '';
};
const useDraftCard = (campaign: Campaign, isProtocolTeam: boolean) => {
    const milestoneStatusId = getMilestoneStatusId(campaign);
    const currentMilestone = getCurrentMilestone(campaign);

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
        currentMilestone,
    };
};

export default useDraftCard;
