import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';
import { useEffect, useState } from 'react';
import { ButtonsForCampaignPage, type ButtonType } from '@/utils/constants';
import { useModal } from '@/contexts/ModalContext';

type SocialLinkKeys = 'website' | 'facebook' | 'instagram' | 'discord' | 'twitter';

const useSocialMediaCard = () => {
    const { campaign, setCampaign, editionMode, isAdmin, isProtocolTeam, isLoading } = useCampaignIdStore();
    const [selectedLink, setSelectedLink] = useState<SocialLinkKeys>('website');
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [buttons, setButtons] = useState<ButtonType[]>([]);

    useEffect(() => {
        if (campaign._DB_id !== '') {
            const { buttons } = ButtonsForCampaignPage(Number(campaign.campaign_status_id), isProtocolTeam, isAdmin);
            setButtons(buttons);
        }
    }, [campaign, isProtocolTeam, isAdmin]);

    const editLinkButton = () => {
        setModalOpen(true);
    };

    const getPlaceholder = () => {
        const linkValue = campaign[selectedLink];
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
        modalOpen,
        setModalOpen,
        buttons,
        campaign,
        setCampaign,
        editionMode,
    };
};

export default useSocialMediaCard;
