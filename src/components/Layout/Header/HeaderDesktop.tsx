import BtnCampaign from '@/components/General/Buttons/Campaign/BtnCampaign';
import BtnConnectWallet from '@/components/General/Buttons/ConnectWallet/BtnConnectWallet';
import TogglePrice from '@/components/General/Buttons/Toggle/TogglePrice';
import Link from 'next/link';
import styles from './HeaderDesktop.module.scss';
import { ROUTES } from '@/utils/constants/routes';

export default function HeaderDesktop() {
    return (
        <div className={styles.headerDesktop}>
            <nav className={styles.navSection}>
                <Link href={ROUTES.howitworks} className={styles.infoLink}>
                    How it works
                </Link>
                <Link href={ROUTES.aboutus} className={styles.infoLink}>
                    About us
                </Link>
                <Link href={ROUTES.campaigns} className={styles.infoLink}>
                    Campaigns
                </Link>
            </nav>
            <div className={styles.btnSection}>
                <div className={styles.togglePriceContainer}>
                    <TogglePrice />
                </div>
                <BtnCampaign type="primary" width={210} />
                <BtnConnectWallet type="primary" width={166} />
            </div>
        </div>
    );
}
