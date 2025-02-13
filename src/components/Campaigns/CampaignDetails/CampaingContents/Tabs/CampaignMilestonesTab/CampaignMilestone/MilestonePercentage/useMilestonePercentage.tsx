import { ICampaignDetails } from '@/hooks/useCampaingDetails';
import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import { formatMoneyByADAOrDollar } from '@/store/generalStore/useGeneralStore';
import type { MilestoneEX } from '@/types/types';
import { useEffect, useState } from 'react';

export interface MilestonePercentageProps {
    milestone: MilestoneEX;
    maxAvailablePercentage: number;
    onPercentageChange: (percentage: number) => boolean;
}

const useMilestonePercentage = (props: MilestonePercentageProps & ICampaignIdStoreSafe & ICampaignDetails) => {
    const { campaign, milestone, onPercentageChange } = props;
    const [percentage, setPercentage] = useState<number>(milestone.milestone.percentage);

    useEffect(() => {
        setPercentage(milestone.milestone.percentage);
    }, [milestone.milestone.percentage]);

    const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, ''); // Remove non-digits
        if (value === '' || /^\d+$/.test(value)) {
            const newValue = value === '' ? 0 : Math.min(100, parseInt(value, 10));
            const success = onPercentageChange(newValue);
            if (success) {
                setPercentage(newValue);
            }
        }
    };

    const percentageGoal = (Number(campaign.campaign.requestedMaxADA) * percentage) / 100;
    const formattedGoal = formatMoneyByADAOrDollar(percentageGoal);

    return {
        percentage,
        setPercentage,
        handlePercentageChange,
        formattedGoal,
    };
};

export default useMilestonePercentage;
