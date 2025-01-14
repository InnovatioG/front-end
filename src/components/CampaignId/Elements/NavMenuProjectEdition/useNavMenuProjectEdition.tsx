
import { useScreenSize } from "@/hooks/useScreenSize";
import React, { useEffect, useState } from "react"
import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';


const useNavMenuProjectEdition = () => {
    const { menuView, setMenuView, editionMode, campaign } = useCampaignIdStore();
    const screenSize = useScreenSize()
    const [isOpen, setIsOpen] = useState(false);
    const handleClickButtonMenuMobile = (item: 'Campaign Detail' | 'Resume of the team' | 'Roadmap & Milestones' | 'Tokenomics' | 'Q&A') => {
        setMenuView(item);
        setIsOpen(!isOpen);
    };


    return {
        menuView,
        setMenuView,
        editionMode,
        campaign,
        screenSize,
        isOpen,
        setIsOpen,
        handleClickButtonMenuMobile
    }


}


export default useNavMenuProjectEdition

