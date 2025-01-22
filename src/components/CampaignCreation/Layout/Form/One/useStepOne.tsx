import { useCampaignStore } from "@/store/campaign/useCampaignStore";
import { useGeneralStore } from "@/store/generalConstants/useGeneralConstants";
import { usePriceStore } from "@/store/price/usepriceAdaOrDollar";
import { useEffect } from "react";


export default function useStepOne() {

    const { setDescription } = useCampaignStore()
    const { campaignCategories } = useGeneralStore()
    const { setPriceAdaOrDollar } = usePriceStore()


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
        setPriceAdaOrDollar("ada")
    }, [])

    return {
        categoryOptions,
        handleDescriptionChange
    }
}