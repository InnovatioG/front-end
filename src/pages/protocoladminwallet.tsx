import type { NextPage } from 'next';
import styles from './index.module.scss';
import ProtocolAdminWallet from '../components/public/ProtocolAdminWallet/ProtocolAdminWallet';

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
