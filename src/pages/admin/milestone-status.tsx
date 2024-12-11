import type { NextPage } from 'next';
import styles from '@/styles/Admin.module.scss';
import MilestoneStatus from '../../components/Admin/MilestoneStatus/MilestoneStatus';

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
