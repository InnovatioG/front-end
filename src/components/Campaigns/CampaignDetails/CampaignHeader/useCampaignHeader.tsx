import { ICampaignDetails } from '@/hooks/useCampaingDetails';
import { CampaignEntity } from '@/lib/SmartDB/Entities';
import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import { isBlobURL } from '@/utils/utils';
import { useRef } from 'react';
import { isNullOrBlank } from 'smart-db';

const useCampaignHeader = (props: ICampaignIdStoreSafe & ICampaignDetails) => {
    const { campaign, setCampaign, setCampaignEX } = props;

    const handleChangeAvatar = (picture: string) => {
        // Me aseguro de que si el member tenia imagen cargada en s3, la voy a eliminar
        let files_to_delete: string[] = [...(campaign.files_to_delete || [])];
        if (!isNullOrBlank(campaign.campaign.logo_url) && !isBlobURL(campaign.campaign.logo_url)) {
            files_to_delete.push(campaign.campaign.logo_url!);
        }

        campaign.campaign.logo_url = picture;

        setCampaignEX({
            ...campaign,
            files_to_delete,
        });
    };

    const handleChangeBanner = (picture: string) => {
        let files_to_delete: string[] = [...(campaign.files_to_delete || [])];
        if (!isNullOrBlank(campaign.campaign.banner_url) && !isBlobURL(campaign.campaign.banner_url)) {
            files_to_delete.push(campaign.campaign.banner_url!);
        }

        campaign.campaign.banner_url = picture;

        setCampaignEX({
            ...campaign,
            files_to_delete,
        });
    };

    return {
        handleChangeAvatar,
        handleChangeBanner,
    };
};

export default useCampaignHeader;
