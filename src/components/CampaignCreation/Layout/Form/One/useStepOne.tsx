import { useCampaignStore } from "@/store/campaign/useCampaignStore";
import { useGeneralStore } from "@/store/generalConstants/useGeneralConstants";



export default function useStepOne() {

    const { setDescription } = useCampaignStore()
    const { campaignCategories } = useGeneralStore()


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

    return {
        categoryOptions,
        handleDescriptionChange
    }
}