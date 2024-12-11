import type { NextPage } from 'next';
import styles from '@/styles/Admin.module.scss';
import Milestone from '../../components/Admin/Milestone/Milestone';

const MilestonePage: NextPage = () => {
    return (
        <>
            <main >
                <Milestone />
            </main>
        </>
    );
};

export default MilestonePage;
