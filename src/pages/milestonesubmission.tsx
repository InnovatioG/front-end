import type { NextPage } from 'next';
import styles from './index.module.scss';
import MilestoneSubmission from '../components/public/MilestoneSubmission/MilestoneSubmission';

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
