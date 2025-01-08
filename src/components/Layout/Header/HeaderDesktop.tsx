import Link from 'next/link';
import styles from './HeaderDesktop.module.scss';
import BtnCampaign from '@/components/UI/Buttons/Campaign/BtnCampaign';
import BtnConnectWallet from '@/components/UI/Buttons/ConnectWallet/BtnConnectWallet';
import { CALENDAR } from '@/utils/images';
import { Session } from 'next-auth';
import TogglePrice from '@/components/UI/Buttons/Toggle/TogglePrice';

export default function HeaderDesktop({ session, setIsOpen, isOpen }: { session: Session | null; setIsOpen: (isOpen: boolean) => void; isOpen: boolean }) {
    return (
        <div className={styles.headerDesktop}>
            <nav className={styles.navSection}>
                <Link href={''} className={styles.infoLink}>
                    How it works
                </Link>
                <Link href={''} className={styles.infoLink}>
                    About us
                </Link>
                <Link href={'/campaigns'} className={styles.infoLink}>
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
