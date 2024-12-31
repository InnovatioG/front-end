import type { NextPage } from 'next';
import styles from '@/styles/Admin.module.scss';
import CampaignFunds from '../../components/Admin/CampaignFunds/CampaignFunds';

const CampaignFundsPage: NextPage = () => {
    return (
        <>
            <main >
                <CampaignFunds />
            </main>
        </>
    );
};

export default CampaignFundsPage;
