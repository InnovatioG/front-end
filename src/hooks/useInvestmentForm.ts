import { useState } from 'react';
import { getInputFields, getRectangles } from '@/components/invest/constats';

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
    const [amountInAda, setAmountInAda] = useState<number | string>(0);

    const [apiCall, setApiCall] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tokens = parseFloat(e.target.value) || 0;
        setAmountInTokens(tokens);
        setAmountInAda(tokens * (cdCampaignToken_PriceADA ?? 0));
    };

    const handleAdaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const ada = parseFloat(e.target.value) || 0;
        setAmountInAda(ada);
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

    const inputFields = getInputFields(cdCampaignToken_TN, cdRequestedMaxADA, amountInTokens, handleTokenChange, goal, amountInAda, handleAdaChange);

    const rectangles = getRectangles(cdCampaignToken_TN, amountInTokens, amountInAda, deliveryDate);

    return {
        amountInTokens,
        amountInAda,
        apiCall,
        isLoading,
        error,
        success,
        handleTokenChange,
        handleAdaChange,
        handleInvest,
        inputFields,
        rectangles,
    };
};

export default useInvestmentForm;
