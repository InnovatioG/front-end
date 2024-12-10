import type { NextPage } from 'next';
import styles from './index.module.scss';
import CampaignStatus from '../components/public/CampaignStatus/CampaignStatus';

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
