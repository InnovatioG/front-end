import type { NextPage } from 'next';
import styles from './index.module.scss';
import CustomWallet from '../components/public/CustomWallet/CustomWallet';

const CustomWalletPage: NextPage = () => {
    return (
        <>
            <main >
                <CustomWallet />
            </main>
        </>
    );
};

export default CustomWalletPage;
