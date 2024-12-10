import type { NextPage } from 'next';
import styles from './index.module.scss';
import CampaignSubmission from '../components/public/CampaignSubmission/CampaignSubmission';

const CampaignSubmissionPage: NextPage = () => {
    return (
        <>
            <main >
                <CampaignSubmission />
            </main>
        </>
    );
};

export default CampaignSubmissionPage;
