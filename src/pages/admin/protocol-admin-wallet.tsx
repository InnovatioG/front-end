import type { NextPage } from 'next';
import styles from '@/styles/Admin.module.scss';
import ProtocolAdminWallet from '../../components/Admin/ProtocolAdminWallet/ProtocolAdminWallet';

const ProtocolAdminWalletPage: NextPage = () => {
    return (
        <>
            <main >
                <ProtocolAdminWallet />
            </main>
        </>
    );
};

export default ProtocolAdminWalletPage;
