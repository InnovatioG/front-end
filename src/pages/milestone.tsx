import type { NextPage } from 'next';
import styles from './index.module.scss';
import Milestone from '../components/public/Milestone/Milestone';

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
