import type { NextPage } from 'next';
import styles from '@/styles/Admin.module.scss';
import MilestoneSubmission from '../../components/Admin/MilestoneSubmission/MilestoneSubmission';

const MilestoneSubmissionPage: NextPage = () => {
    return (
        <>
            <main >
                <MilestoneSubmission />
            </main>
        </>
    );
};

export default MilestoneSubmissionPage;
