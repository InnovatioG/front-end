import CampaignsDashboard from '@/components/Campaigns/CampaignsDashboard/CampaignsDashboard';
import React from 'react';
import { useWalletStore } from 'smart-db';
import styles from './index.module.scss';
import BtnConnectWallet from '@/components/GeneralOK/Buttons/Buttons/BtnConnectWallet/BtnConnectWallet';
import { useResponsive } from '@/contexts/ResponsiveContext';
import { CampaignViewForEnums } from '@/utils/constants/constants';

interface CampaignsManagePageProps {
    // Define props here
}

const CampaignsManagePage: React.FC<CampaignsManagePageProps> = (props) => {
    const walletStore = useWalletStore();
    const { screenSize } = useResponsive();

    const title = () => (walletStore.isConnected && walletStore.isCoreTeam() ? 'PROTOCOL TEAM MANAGEMENT' : 'CAMPAIGNS MANAGEMENT');

    return (
        <>
            {walletStore.isConnected === false || walletStore.info?.isWalletValidatedWithSignedToken === false ? (
                <div className={styles.campaignSection}>
                    <div className={styles.mainSection}>
                        <h2 className={styles.title}>In order to continue with the management process you must connect wallet in Admin Mode</h2>
                        <div className={styles.btns}>
                            <BtnConnectWallet type="primary" width={screenSize === 'desktop' ? 225 : undefined} />
                        </div>
                    </div>
                </div>
            ) : (
                <div className={styles.draftSection}>
                    <h2 className={styles.title}>{title()}</h2>
                    <CampaignsDashboard campaignViewFor={CampaignViewForEnums.manage} />
                </div>
            )}
        </>
    );
};

export default CampaignsManagePage;
