import { useState, useEffect, useMemo } from "react";
import {
    getTimeRemaining, calculatePorcentage, calculatePorcentagValue, formatTime
} from "@/utils/formats";
import { useGeneralStore } from "@/store/generalConstants/useGeneralConstants";
import { usePriceStore } from "@/store/price/usepriceAdaOrDollar";

interface useCampaignCardProps {
    goal: number;
    min_request: number;
    investors?: number;
    startDate: Date | undefined;
    cdFundedADA?: bigint;
}

const useCampaignCard = ({ startDate, goal, min_request, investors, cdFundedADA }: useCampaignCardProps) => {

    const { adaPrice } = useGeneralStore()
    const { priceAdaOrDollar } = usePriceStore()

    const [timeRemaining, setTimeRemaining] = useState(() => getTimeRemaining(startDate));


    const progressPercentage = useMemo(() => calculatePorcentagValue(goal, Number(cdFundedADA)), [goal, cdFundedADA]);
    const minValuePercantage = useMemo(() => calculatePorcentagValue(goal, min_request), [min_request, goal]);

    const progressWidth = `${progressPercentage}%`;
    const stateClass = useMemo(() => status.toLowerCase().replace(/\s+/g, '-'), [status]);


    console.log(goal)

    const goalInCurrentCurrency = useMemo(
        () => (priceAdaOrDollar === 'dollar' ? Number(goal) : Number(goal) / adaPrice),
        [priceAdaOrDollar, goal, adaPrice]
    );
    const minValueInCurrentCurrency = useMemo(
        () => (priceAdaOrDollar === 'dollar' ? Number(min_request) : Number(min_request) / adaPrice),
        [priceAdaOrDollar, min_request, adaPrice]
    )
    const currencySymbol = useMemo(() => (priceAdaOrDollar === 'dollar' ? 'USD' : 'ADA'), [priceAdaOrDollar]);

    const formatAllTime = (timeRemaining: any) => {
        return `${timeRemaining.days}:${formatTime(timeRemaining.totalHours)}:${formatTime(timeRemaining.minutes)}`;
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeRemaining(getTimeRemaining(startDate));
        }, 1000);

        return () => clearInterval(timer);
    }, [startDate]);


    return { timeRemaining, progressPercentage, minValuePercantage, progressWidth, stateClass, goalInCurrentCurrency, minValueInCurrentCurrency, currencySymbol, formatAllTime };
};

export default useCampaignCard;