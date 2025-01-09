import type { NextPage } from 'next';
import MilestoneStatus from '../../components/Admin/MilestoneStatus/MilestoneStatus';

const MilestoneStatusPage: NextPage = () => {
    return (
        <>
            <main>
                <MilestoneStatus />
            </main>
        </>
    );
};

export default MilestoneStatusPage;
