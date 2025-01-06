import React, { useEffect } from 'react';
import CampaignHighLight from '@/components/CampaignDashboard/highlight/CampaignHighLight';
import CampaignDashboard from '@/components/CampaignDashboard/dashboard/CampaignDashboard';
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
interface CampaignsProps {
    // Define props here
}

const Campaigns: React.FC<CampaignsProps> = (props) => {
    const { fetchAdaPrice } = useProjectDetailStore();

    useEffect(() => {
        fetchAdaPrice();
    }, [fetchAdaPrice]);

    return (
        <div>
            <CampaignDashboard />
        </div>
    );
}

export default Campaigns;