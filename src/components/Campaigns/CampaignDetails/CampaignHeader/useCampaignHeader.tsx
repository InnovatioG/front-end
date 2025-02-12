import { ICampaignDetails } from '@/hooks/useCampaingDetails';
import { CampaignEntity } from '@/lib/SmartDB/Entities';
import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import { useRef } from 'react';

const useCampaignHeader = (props: ICampaignIdStoreSafe & ICampaignDetails) => {
    const { campaign, setCampaign } = props;

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChangePicture = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            // setCampaignEX({
            //     ...campaign,
            //     campaign: new CampaignEntity({ ...campaign.campaign, banner_url: e.target.value }),
            // });
            let entity = campaign.campaign;
            entity.banner_url = e.target.value;
            setCampaign(entity);
        };
        reader.readAsDataURL(file);
    };

    const handleButtonClickFile = () => {
        fileInputRef.current?.click();
    };

    return {
        handleChangePicture,
        handleButtonClickFile,
        fileInputRef,
    };
};

export default useCampaignHeader;
