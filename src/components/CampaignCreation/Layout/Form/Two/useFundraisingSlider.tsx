import { useState, useEffect } from 'react';
import { useCampaignStore } from '@/store/campaign/useCampaignStore';
import { usePriceStore } from '@/store/price/usepriceAdaOrDollar';

export default function useFundraisingSlider() {
    const { setMilestones, newCampaign, setRequestMaxAda, setRequestMinAda, } = useCampaignStore();
    const { priceAdaOrDollar } = usePriceStore();

    const [selectedMilestones, setSelectedMilestones] = useState<number | null>(null);
    const requestMaxAda = newCampaign.requestMaxAda;
    const requestMinAda = newCampaign.requestMinAda;
    const handleSelect = (numMilestones: number) => {
        setSelectedMilestones(numMilestones);
        const milestones = Array.from({ length: numMilestones }, (_, index) => ({
            order: index + 1,
            requestMaxAda: 0,
        }));
        setMilestones(milestones);
    };
    const calculaterequestMaxAda = (requestMaxAda: number, adaPrice: number) => {
        if (priceAdaOrDollar == 'dollar') {
            return requestMaxAda / adaPrice;
        }
        return requestMaxAda;
    };

    useEffect(() => {
        if (requestMinAda > requestMaxAda) {
            setRequestMinAda(requestMaxAda);
        }
    }, [requestMaxAda, requestMinAda, setRequestMinAda]);


    return { selectedMilestones, handleSelect, calculaterequestMaxAda, requestMaxAda, requestMinAda, setRequestMaxAda };
}
