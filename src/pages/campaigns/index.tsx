import CampaignsDashboard from '@/components/Campaigns/CampaignsDashboard/CampaignsDashboard';
import { PageViewEnums } from '@/utils/constants/routes';
import React from 'react';

interface CampaignsPageProps {
    // Define props here
}

const CampaignsPage: React.FC<CampaignsPageProps> = (props) => {
    return (
        <div>
            <CampaignsDashboard pageView={PageViewEnums.CAMPAIGNS} />
        </div>
    );
};

export default CampaignsPage;
