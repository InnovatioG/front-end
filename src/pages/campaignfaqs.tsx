import type { NextPage } from 'next';
import styles from './index.module.scss';
import CampaignFaqs from '../components/public/CampaignFaqs/CampaignFaqs';

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
