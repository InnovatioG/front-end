import type { NextPage } from 'next';
import styles from './index.module.scss';
import Protocol from '../components/public/Protocol/Protocol';

const ProtocolPage: NextPage = () => {
    return (
        <>
            <main >
                <Protocol />
            </main>
        </>
    );
};

export default ProtocolPage;
