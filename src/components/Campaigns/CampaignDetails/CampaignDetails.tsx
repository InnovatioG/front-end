import { useCampaignDetails } from '@/hooks/useCampaingDetails';
import { useCampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import React from 'react';
import { toJson } from 'smart-db';
import styles from './CampaignDetails.module.scss';
import CampaignHeader from './CampaignHeader/CampaignHeader';
import CampaingDetailsContainer from './CampaingDetailsContainer/CampaingDetailsContainer';

interface CampaignsDetailsProps {
    // Define props here
}

const CampaignsDetails: React.FC<CampaignsDetailsProps> = (props) => {
    const propsCampaignIdStoreSafe = useCampaignIdStoreSafe();
    const propsCampaignDetails = useCampaignDetails(propsCampaignIdStoreSafe.campaign);
    return (
        <main className={styles.layout}>
            <div className={styles.campaignContainerCreator}>
                <CampaignHeader {...propsCampaignIdStoreSafe} {...propsCampaignDetails} />
                <CampaingDetailsContainer {...propsCampaignIdStoreSafe} {...propsCampaignDetails} />
                {toJson(propsCampaignIdStoreSafe.campaign)}
                {/* 
                    
                    <ProjectContainer /> */}
            </div>

            {/* <CampaignButtonContainer /> */}
        </main>
    );
};

export default CampaignsDetails;
