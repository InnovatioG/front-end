import NewDraftDashboard from '@/components/CampaignDashboard/Sections/Draft/DraftDashboard';
import LoadingPage from '@/components/LoadingPage/LoadingPage';
import BtnConnectWallet from '@/components/UI/Buttons/ConnectWallet/BtnConnectWallet';
import GoogleConnect from '@/components/UI/Buttons/GoogleConnect/GoogleConnect';
import { useDashboardCard } from '@/hooks/useDashboardCard';
import { useScreenSize } from '@/hooks/useScreenSize';
import { useSession } from 'next-auth/react';
import { useWalletStore } from 'smart-db';
import styles from './Campaign.module.scss';

export default function Home() {
    const walletStore = useWalletStore();
    const address = walletStore.info?.address || '';
    console.log(walletStore.info)
    const { data: session } = useSession();
    const screenSize = useScreenSize();
    const { isProtocolTeam, campaignsLoading } = useDashboardCard(address);

    const title = () => (isProtocolTeam ? 'PROTOCOL TEAM' : 'CAMPAIGN MANAGERS');

    return (
        <>
            {address === null && session === null ? (
                <div className={styles.campaignSection}>
                    <div className={styles.mainSection}>
                        <h2 className={styles.title}>In order to continue with the creation process you must register with your Google account or connect wallet</h2>
                        <div className={styles.btns}>
                            <GoogleConnect width={screenSize === 'desktop' ? 225 : undefined} />
                            <BtnConnectWallet type="primary" width={screenSize === 'desktop' ? 225 : undefined} />
                        </div>
                    </div>
                </div>
            ) : (
                <div className={styles.draftSection}>
                    {campaignsLoading && <LoadingPage />}
                    <h2 className={styles.title}>{title()}</h2>
                    <NewDraftDashboard address={address} />
                </div>
            )}
        </>
    );
}
