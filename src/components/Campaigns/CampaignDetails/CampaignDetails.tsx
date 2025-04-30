import { useCampaignDetails } from '@/hooks/useCampaingDetails';
import { useCampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import { PageViewEnums } from '@/utils/constants/routes';
import React from 'react';
import CampaignActions from './CampaignActions/CampaignActions';
import styles from './CampaignDetails.module.scss';
import CampaignHeader from './CampaignHeader/CampaignHeader';
import CampaingContents from './CampaingContents/CampaingContents';
import { useGeneralStore } from '@/store/generalStore/useGeneralStore';
import { toJson } from 'smart-db';

export interface CampaignsDetailsProps {
    pageView: PageViewEnums;
}

const CampaignsDetails: React.FC<CampaignsDetailsProps> = (props) => {
    const propsCampaignIdStoreSafe = useCampaignIdStoreSafe();
    const propsCampaignDetails = useCampaignDetails({
        campaign: propsCampaignIdStoreSafe.campaign,
        pageView: props.pageView,
        isEditMode: propsCampaignIdStoreSafe.isEditMode,
        isValidEdit: propsCampaignIdStoreSafe.isValidEdit,
        setIsValidEdit: propsCampaignIdStoreSafe.setIsValidEdit,
        setCampaignEX: propsCampaignIdStoreSafe.setCampaignEX,
        setCampaign: propsCampaignIdStoreSafe.setCampaign,
    });
    const { showDebug } = useGeneralStore();
    return (
        <main className={styles.layout}>
            <div className={styles.campaignContainerCreator}>
                {showDebug && `DEBUG - isAdmin: ${propsCampaignDetails.isAdmin} - isEditMode: ${propsCampaignIdStoreSafe.isEditMode}`}
                <CampaignHeader {...propsCampaignIdStoreSafe} {...propsCampaignDetails} />
                <CampaingContents {...propsCampaignIdStoreSafe} {...propsCampaignDetails} />
                <CampaignActions {...propsCampaignIdStoreSafe} {...propsCampaignDetails} />
            </div>
        </main>
    );
};

export default CampaignsDetails;
