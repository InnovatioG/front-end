import { useModal } from '@/contexts/ModalContext';
import { ICampaignDetails } from '@/hooks/useCampaingDetails';
import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import { SocialOptions } from '@/utils/constants/constants';
import { useState } from 'react';

const useCampaignHeaderSocialAndButton = (props: ICampaignIdStoreSafe & ICampaignDetails) => {
    const { campaign } = props;
    const [selectedLink, setSelectedLink] = useState<SocialOptions>(SocialOptions.WEBSITE);

    const { openModal, isOpen, setIsOpen } = useModal();

    const editLinkButton = () => {
        setIsOpen(true);
    };

    const getPlaceholder = () => {
        const linkValue = campaign.campaign[selectedLink];
        return linkValue && linkValue !== '' ? linkValue : `Enter your ${selectedLink} link`;
    };

    const formatSocialLink = (link: string) => {
        if (!link.startsWith('http://') && !link.startsWith('https://')) {
            return `https://${link}`;
        }
        return link;
    };

    return {
        selectedLink,
        setSelectedLink,
        editLinkButton,
        getPlaceholder,
        formatSocialLink,
        openModal,
        isOpen,
        setIsOpen,
    };
};

export default useCampaignHeaderSocialAndButton;
