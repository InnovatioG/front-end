import { useState, useEffect } from 'react';
import { useCampaignStore } from '@/store/campaign/useCampaignStore';
import { usePriceStore } from '@/store/price/usepriceADAOrDollar';

export default function useFundraisingSlider() {
    const { setMilestones, newCampaign, setRequestMaxADA, setRequestMinADA, } = useCampaignStore();
    const { priceADAOrDollar } = usePriceStore();

    const [selectedMilestones, setSelectedMilestones] = useState<number | null>(null);
    const requestMaxADA = newCampaign.requestMaxADA;
    const requestMinADA = newCampaign.requestMinADA;
    const handleSelect = (numMilestones: number) => {
        setSelectedMilestones(numMilestones);
        const milestones = Array.from({ length: numMilestones }, (_, index) => ({
            order: index + 1,
            requestMaxADA: 0,
        }));
        setMilestones(milestones);
    };
    const calculaterequestMaxADA = (requestMaxADA: number, adaPrice: number) => {
        if (priceADAOrDollar == 'dollar') {
            return requestMaxADA / adaPrice;
        }
        return requestMaxADA;
    };

    useEffect(() => {
        if (requestMinADA > requestMaxADA) {
            setRequestMinADA(requestMaxADA);
        }
    }, [requestMaxADA, requestMinADA, setRequestMinADA]);


    return { selectedMilestones, handleSelect, calculaterequestMaxADA, requestMaxADA, requestMinADA, setRequestMaxADA };
}
