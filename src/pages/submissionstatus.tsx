import type { NextPage } from 'next';
import styles from './index.module.scss';
import SubmissionStatus from '../components/public/SubmissionStatus/SubmissionStatus';

const SubmissionStatusPage: NextPage = () => {
    return (
        <>
            <main >
                <SubmissionStatus />
            </main>
        </>
    );
};

export default SubmissionStatusPage;
