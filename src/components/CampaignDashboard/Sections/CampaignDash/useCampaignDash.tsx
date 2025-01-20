import useDraftCard from "@/hooks/useDraftCard";
import { useCampaignIdStore } from "@/store/campaignId/useCampaignIdStore";
import { CardInformationByState } from "@/utils/constants";
import { useRef } from "react";


const useCampaignDash = () => {

    const fileInputRef = useRef<HTMLInputElement>(null);

    const { campaign, editionMode, setCampaign, isProtocolTeam, isAdmin } = useCampaignIdStore();
    const { requestMaxAda, requestMinAda, investors, begin_at, cdFundedADA } = campaign


    console.log(requestMaxAda)

    const { label, getInternalId } = useDraftCard(campaign, isProtocolTeam, isAdmin);





    const handleChangePicture = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setCampaign({ ...campaign, banner_url: reader.result as string });
        };
        reader.readAsDataURL(file);
    };

    const handleButtonClickFile = () => {
        fileInputRef.current?.click();
    };

    return {
        requestMaxAda,
        requestMinAda,
        investors,
        begin_at,
        cdFundedADA,
        label,
        handleChangePicture,
        handleButtonClickFile,
        fileInputRef,
        setCampaign,
        editionMode,
        campaign,
        getInternalId
    }
}


export default useCampaignDash