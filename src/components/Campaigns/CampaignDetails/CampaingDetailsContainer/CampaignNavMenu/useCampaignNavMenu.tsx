import { ICampaignDetails } from '@/hooks/useCampaingDetails';
import { useScreenSize } from '@/hooks/useScreenSize';
import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { CampaignTab, ROUTES } from '@/utils/constants/routes';


const useCampaignNavMenu = (props: ICampaignIdStoreSafe & ICampaignDetails) => {
    const { campaign,menuView, setMenuView } = props;
    const screenSize = useScreenSize();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const handleTabChangeMobile = (tab: CampaignTab) => {
        setMenuView(tab);
        setIsOpen(!isOpen);
        router.push(ROUTES.campaignTab(campaign.campaign._DB_id, tab), undefined, { shallow: true });
    };

    const handleTabChange = (tab: CampaignTab) => {
        setMenuView(tab);
        router.push(ROUTES.campaignTab(campaign.campaign._DB_id, tab), undefined, { shallow: true });
    };

    return {
        menuView,
        screenSize,
        isOpen,
        setIsOpen,
        handleTabChangeMobile,handleTabChange
    };
};

export default useCampaignNavMenu;
