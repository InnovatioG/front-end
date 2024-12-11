import type { NextPage } from 'next';
import styles from '@/styles/Admin.module.scss';
import CustomWallet from '../../components/Admin/CustomWallet/CustomWallet';

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
