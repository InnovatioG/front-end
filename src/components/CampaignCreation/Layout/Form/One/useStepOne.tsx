import { useCampaignStore } from "@/store/campaign/useCampaignStore";
import { useGeneralStore } from "@/store/generalConstants/useGeneralConstants";
import { usePriceStore } from "@/store/price/usepriceADAOrDollar";
import { useEffect } from "react";


export default function useStepOne() {

    const { setDescription } = useCampaignStore()
    const { campaignCategories } = useGeneralStore()
    const { setPriceADAOrDollar } = usePriceStore()


    const categoryOptions = campaignCategories.map((category) => ({
        value: category.id,
        label: category.name,

    }))
    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        if (value.length <= 240) {
            setDescription(value);
        }
    }


    useEffect(() => {
        setPriceADAOrDollar("ada")
    }, [])

    return {
        categoryOptions,
        handleDescriptionChange
    }
}