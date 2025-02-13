import { useResponsive } from '@/contexts/ResponsiveContext';
import { ICampaignDetails } from '@/hooks/useCampaingDetails';
import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import { CampaignTabEnum, ROUTES } from '@/utils/constants/routes';
import { useRouter } from 'next/router';
import { useState } from 'react';

const useCampaignNavMenu = (props: ICampaignIdStoreSafe & ICampaignDetails) => {
    const { campaign, campaignTab, setCampaignTab, pageView, isEditMode } = props;
    const { screenSize } = useResponsive();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const handleTabChangeMobile = (tab: CampaignTabEnum) => {
        setIsOpen(!isOpen);
        router.push(ROUTES.campaignDynamicTab(campaign.campaign._DB_id, tab, pageView, isEditMode), undefined, { shallow: true });
    };

    const handleTabChange = (tab: CampaignTabEnum) => {
        router.push(ROUTES.campaignDynamicTab(campaign.campaign._DB_id, tab, pageView, isEditMode), undefined, { shallow: true });
    };

    return {
        campaignTab,
        screenSize,
        isOpen,
        setIsOpen,
        handleTabChangeMobile,
        handleTabChange,
    };
};

export default useCampaignNavMenu;
