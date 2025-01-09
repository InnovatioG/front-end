import CampaignDashboard from '@/components/CampaignDashboard/Sections/Dashboard/CampaignDashboard';
import { useProjectDetailStore } from '@/store/projectdetail/useCampaignIdStore';
import React, { useEffect } from 'react';
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
};

export default Campaigns;
