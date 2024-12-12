import type { NextPage } from 'next';
import styles from '@/styles/Admin.module.scss';
import CampaignFaqs from '../../components/Admin/CampaignFaqs/CampaignFaqs';

const CampaignFaqsPage: NextPage = () => {
    return (
        <>
            <main >
                <CampaignFaqs />
            </main>
        </>
    );
};

export default CampaignFaqsPage;
