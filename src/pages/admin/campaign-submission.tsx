import type { NextPage } from 'next';
import styles from '@/styles/Admin.module.scss';
import CampaignSubmission from '../../components/Admin/CampaignSubmission/CampaignSubmission';

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
