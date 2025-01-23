import { useState, useEffect } from "react";
import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';
import { usePriceStore } from '@/store/price/usepriceADAOrDollar';
import { useGeneralStore } from '@/store/generalConstants/useGeneralConstants';
import type { Milestone } from "@/types/types";
import { formatMoney } from "@/utils/formats";



const useMilestonePercentage = (milestone: Milestone, goal: number, maxAvailablePercentage: number, onPercentageChange: (percentage: number) => boolean
) => {
    const [percentage, setPercentage] = useState<number>(milestone.percentage);
    const { priceADAOrDollar } = usePriceStore();
    const { adaPrice } = useGeneralStore();

    useEffect(() => {
        setPercentage(milestone.percentage);
    }, [milestone.percentage]);

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

    const goalInCurrentCurrency = priceADAOrDollar === 'dollar' ? Number(goal) : Number(goal) / adaPrice;
    const currencySymbol = priceADAOrDollar === 'dollar' ? 'USD' : 'ADA';

    const percentageGoal = (goalInCurrentCurrency * percentage) / 100;
    const formattedGoal = formatMoney(percentageGoal, currencySymbol);



    return {
        percentage,
        setPercentage,
        handlePercentageChange,
        formattedGoal
    }
}

export default useMilestonePercentage