import CampaignsDashboard from '@/components/Campaigns/CampaignsDashboard/CampaignsDashboard';
import { CampaignViewForEnums } from '@/utils/constants/constants';
import React from 'react';

interface CampaignsPageProps {
    // Define props here
}

const CampaignsPage: React.FC<CampaignsPageProps> = (props) => {
    return (
        <div>
            <CampaignsDashboard campaignViewFor={CampaignViewForEnums.campaigns} />
        </div>
    );
};

export default CampaignsPage;
