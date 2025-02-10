import CampaignsDashboard from '@/components/Campaigns/CampaignsDashboard/CampaignsDashboard';
import React from 'react';

interface CampaignsPageProps {
    // Define props here
}

const CampaignsPage: React.FC<CampaignsPageProps> = (props) => {
    return (
        <div>
            <CampaignsDashboard />
        </div>
    );
};

export default CampaignsPage;
