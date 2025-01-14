import { inputFieldsToken } from "@/utils/constants";
import { useGeneralStore } from "@/store/generalConstants/useGeneralConstants";
import { useCampaignIdStore } from "@/store/campaignId/useCampaignIdStore";

const useTokenomics = () => {

    const { campaign, setCampaign } = useCampaignIdStore();
    const { adaPrice } = useGeneralStore();

    const handleInputChange = (id: string, value: string, transform: (value: string) => any) => {
        setCampaign({
            ...campaign,
            [id]: transform(value),
        });
    };

    const fields = inputFieldsToken(campaign);

    /*     const valuePerToken =
            campaign.requestMaxAda === null || isNaN(campaign.requestMaxAda) ? (
                'Price per token'
            ) : (
                <div className={styles.priceInAda}>
                    <img src={'/img/icons/ADA.svg'} alt="ADA" height={12} width={12} />
                    <span>{(campaign.requestMaxAda / project.cdRequestedMaxADA / adaPrice).toFixed(2)}</span>
                </div>
            ); */

    return {
        fields,
        handleInputChange,
        setCampaign,
        campaign
    }

}

export default useTokenomics