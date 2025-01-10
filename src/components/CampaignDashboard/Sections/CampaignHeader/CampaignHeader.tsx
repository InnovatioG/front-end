import { Avatar, AvatarFallback, AvatarImage } from '@/components/General/Elements/DefaultAvatar/DefaultAvatar';
import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';
import React from 'react';
import styles from './CampaignHeader.module.scss';

interface CampaignHeaderProps { }

const CampaignHeader: React.FC<CampaignHeaderProps> = () => {
    const { campaign } = useCampaignIdStore();

    return (
        <div className={styles.headerCampaignContainer}>
            <Avatar big={true} className={styles.pictureContainer}>
                <AvatarImage src={campaign.logo_url} alt={campaign.name} />
                <AvatarFallback>{campaign.name[0]}</AvatarFallback>
            </Avatar>
            <h2 className={styles.title}>{campaign.name}</h2>
        </div>
    );
};

export default CampaignHeader;
