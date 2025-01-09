import type { NextPage } from 'next';
import SubmissionStatus from '../../components/Admin/SubmissionStatus/SubmissionStatus';

const SubmissionStatusPage: NextPage = () => {
    return (
        <>
            <main>
                <SubmissionStatus />
            </main>
        </>
    );
};

export default SubmissionStatusPage;
