import type { NextPage } from 'next';
import styles from '@/styles/Admin.module.scss';
import CampaignStatus from '../../components/Admin/CampaignStatus/CampaignStatus';

const CampaignStatusPage: NextPage = () => {
    return (
        <>
            <main >
                <CampaignStatus />
            </main>
        </>
    );
};

export default CampaignStatusPage;
