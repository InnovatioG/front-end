import { useModal } from '@/contexts/ModalContext';
import { ICampaignDetails } from '@/hooks/useCampaingDetails';
import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import { ModalEnums, SocialOptionsEnums } from '@/utils/constants/constants';
import { ReactNode, useState } from 'react';

const useCampaignSocialLinksAndActions = (props: ICampaignIdStoreSafe & ICampaignDetails) => {
    const { campaign } = props;
    const [selectedLink, setSelectedLink] = useState<SocialOptionsEnums>(SocialOptionsEnums.WEBSITE);

    const { openModal, closeModal } = useModal();
    
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

    const editLinkButton = (modal: ReactNode) => {
        openModal(ModalEnums.editSocialLink, {}, modal);
    };

    return {
        selectedLink,
        setSelectedLink,

        getPlaceholder,
        formatSocialLink,editLinkButton, openModal, closeModal
    };
};

export default useCampaignSocialLinksAndActions;
