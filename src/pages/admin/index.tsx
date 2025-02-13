import BtnConnectWallet from '@/components/GeneralOK/Buttons/Buttons/BtnConnectWallet/BtnConnectWallet';
import { useResponsive } from '@/contexts/ResponsiveContext';
import { useWalletStore } from 'smart-db';
import styles from './index.module.scss';
import AdminDashboard from '@/components/Admin/_AdminDashboard/AdminDashboard';

interface AdminDashboardPageProps {
    // Define props here
}

const AdminDashboardPage: React.FC<AdminDashboardPageProps> = (props) => {

    const walletStore = useWalletStore();
    const { screenSize } = useResponsive();

    // If the user is not connected, show the connect wallet screen
    if (!walletStore.isConnected || !walletStore.info?.isWalletValidatedWithSignedToken) {
        return (
            <div className={styles.campaignSection}>
                <div className={styles.mainSection}>
                    <h2 className={styles.title}>In order to continue with the management process you must connect wallet in Admin Mode</h2>
                    <div className={styles.btns}>
                        <BtnConnectWallet type="primary" width={screenSize === 'desktop' ? 225 : undefined} />
                    </div>
                </div>
            </div>
        );
    }

    return <div><AdminDashboard /></div>
};

export default AdminDashboardPage;
