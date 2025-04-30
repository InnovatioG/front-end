import { BtnCampaignActions } from '@/components/GeneralOK/Buttons/Buttons/BtnCampaignActions/BtnCampaignActions';
import { ICampaignDetails } from '@/hooks/useCampaingDetails';
import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import { ButtonType } from '@/utils/constants/buttons';
import React from 'react';
import styles from './CampaignActions.module.scss';

const CampaignActions: React.FC<ICampaignIdStoreSafe & ICampaignDetails> = (props: ICampaignIdStoreSafe & ICampaignDetails) => {
    const { campaign, buttonsForDetails, handles } = props;

    return (
        <div className={styles.buttonContainer}>
            {buttonsForDetails.map((button: ButtonType, index: number) => (
                <BtnCampaignActions key={index} button={button} data={{ campaign_id: campaign.campaign._DB_id }} handles={handles} />
            ))}
        </div>
    );
};

export default CampaignActions;
