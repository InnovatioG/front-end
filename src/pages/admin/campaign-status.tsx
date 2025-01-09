import type { NextPage } from 'next';
import CampaignStatus from '../../components/Admin/CampaignStatus/CampaignStatus';

const CampaignStatusPage: NextPage = () => {
    return (
        <>
            <main>
                <CampaignStatus />
            </main>
        </>
    );
};

export default CampaignStatusPage;
