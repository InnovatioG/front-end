import type { NextPage } from 'next';
import styles from '@/styles/Admin.module.scss';
import Protocol from '../../components/Admin/Protocol/Protocol';

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
