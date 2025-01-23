import { getInputFields, getRectangles } from '@/components/Invest/constats';
import { useState } from 'react';

interface UseInvestmentFormProps {
    cdCampaignToken_PriceADA: number | null;
    cdCampaignToken_TN: string;
    cdRequestedMaxADA: number | null;
    goal: number;
    id: number;
    deliveryDate: string;
}

const useInvestmentForm = ({ cdCampaignToken_PriceADA, cdCampaignToken_TN, cdRequestedMaxADA, goal, id, deliveryDate }: UseInvestmentFormProps) => {
    const [amountInTokens, setAmountInTokens] = useState<number | string>(0);
    const [amountInADA, setAmountInADA] = useState<number | string>(0);

    const [apiCall, setApiCall] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tokens = parseFloat(e.target.value) || 0;
        setAmountInTokens(tokens);
        setAmountInADA(tokens * (cdCampaignToken_PriceADA ?? 0));
    };

    const handleADAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const ada = parseFloat(e.target.value) || 0;
        setAmountInADA(ada);
        setAmountInTokens(cdCampaignToken_PriceADA ? ada / cdCampaignToken_PriceADA : 0);
    };

    const handleInvest = () => {
        setIsLoading(true);
        setApiCall(true);
        setError(null);
        setSuccess(null);

        // Simulación de una llamada a la API
        setTimeout(() => {
            setIsLoading(false);
            setSuccess('Your transaction has been confirmed');
        }, 2000);
    };

    const inputFields = getInputFields(cdCampaignToken_TN, cdRequestedMaxADA, amountInTokens, handleTokenChange, goal, amountInADA, handleADAChange);

    const rectangles = getRectangles(cdCampaignToken_TN, amountInTokens, amountInADA, deliveryDate);

    return {
        amountInTokens,
        amountInADA,
        apiCall,
        isLoading,
        error,
        success,
        handleTokenChange,
        handleADAChange,
        handleInvest,
        inputFields,
        rectangles,
    };
};

export default useInvestmentForm;
