import BtnHeaderCampaignNewOrManage from '@/components/GeneralOK/Buttons/Buttons/BtnHeaderCampaignNewOrManage/BtnHeaderCampaignNewOrManage';
import TogglePrice from '@/components/General/Buttons/Toggle/TogglePrice';
import Link from 'next/link';
import styles from './HeaderDesktop.module.scss';
import { ROUTES } from '@/utils/constants/routes';
import BtnConnectWallet from '@/components/GeneralOK/Buttons/Buttons/BtnConnectWallet/BtnConnectWallet';

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
                <BtnHeaderCampaignNewOrManage type="primary" width={210} />
                <BtnConnectWallet type="primary" width={166} />
            </div>
        </div>
    );
}
