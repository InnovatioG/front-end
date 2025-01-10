import CampaignDashboard from '@/components/CampaignDashboard/Sections/Dashboard/CampaignDashboard';
import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';
import React, { useEffect } from 'react';
interface CampaignsProps {
    // Define props here
}

const Campaigns: React.FC<CampaignsProps> = (props) => {
    const { fetchAdaPrice } = useCampaignIdStore();

    useEffect(() => {
        fetchAdaPrice();
    }, [fetchAdaPrice]);

    return (
        <div>
            <CampaignDashboard />
        </div>
    );
};

export default Campaigns;
