import type { NextPage } from 'next';
import styles from './index.module.scss';
import MilestoneStatus from '../components/public/MilestoneStatus/MilestoneStatus';

const MilestoneStatusPage: NextPage = () => {
    return (
        <>
            <main >
                <MilestoneStatus />
            </main>
        </>
    );
};

export default MilestoneStatusPage;
