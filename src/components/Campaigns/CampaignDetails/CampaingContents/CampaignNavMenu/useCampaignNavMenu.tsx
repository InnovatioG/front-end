import { ICampaignDetails } from '@/hooks/useCampaingDetails';
import { useResponsive } from '@/contexts/ResponsiveContext';
import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { CampaignTabEnum, CampaignTabUrls, ROUTES } from '@/utils/constants/routes';
import { CampaignViewForEnums } from '@/utils/constants/constants';

const useCampaignNavMenu = (props: ICampaignIdStoreSafe & ICampaignDetails) => {
    const { campaign, campaignTab, setCampaignTab, campaignViewFor, isEditMode } = props;
    const { screenSize } = useResponsive();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const handleTabChangeMobile = (tab: CampaignTabEnum) => {
        setIsOpen(!isOpen);
        router.push(ROUTES.campaignDynamicTab(campaign.campaign._DB_id, tab, campaignViewFor, isEditMode), undefined, { shallow: true });
    };

    const handleTabChange = (tab: CampaignTabEnum) => {
        router.push(ROUTES.campaignDynamicTab(campaign.campaign._DB_id, tab, campaignViewFor, isEditMode), undefined, { shallow: true });
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
