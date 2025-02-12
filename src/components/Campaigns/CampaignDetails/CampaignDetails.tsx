import { useCampaignDetails } from '@/hooks/useCampaingDetails';
import { useCampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import { CampaignViewForEnums } from '@/utils/constants/constants';
import React, { useEffect } from 'react';
import { toJson } from 'smart-db';
import CampaignActions from './CampaignActions/CampaignActions';
import styles from './CampaignDetails.module.scss';
import CampaignHeader from './CampaignHeader/CampaignHeader';
import CampaingContents from './CampaingContents/CampaingContents';

export interface CampaignsDetailsProps {
    campaignViewFor: CampaignViewForEnums;
}

const CampaignsDetails: React.FC<CampaignsDetailsProps> = (props) => {
    const propsCampaignIdStoreSafe = useCampaignIdStoreSafe();
    const propsCampaignDetails = useCampaignDetails({ campaign: propsCampaignIdStoreSafe.campaign, campaignViewFor: props.campaignViewFor, isEditMode: propsCampaignIdStoreSafe.isEditMode });

    return (
        <main className={styles.layout}>
            <div className={styles.campaignContainerCreator}>
            {`DEBUG - isAdmin: ${propsCampaignDetails.isAdmin } - isEditMode: ${propsCampaignIdStoreSafe.isEditMode }`}
                <CampaignHeader {...propsCampaignIdStoreSafe} {...propsCampaignDetails} />
                <CampaingContents {...propsCampaignIdStoreSafe} {...propsCampaignDetails} />
                <CampaignActions {...propsCampaignIdStoreSafe} {...propsCampaignDetails} />
            </div>
        </main>
    );
};

export default CampaignsDetails;
