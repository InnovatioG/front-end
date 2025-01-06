import styles from './HeaderMobile.module.scss';
import BtnCampaign from '../../ui/buttons/campaign/BtnCampaign';
import BtnConnectWallet from '../../ui/buttons/connectWallet/BtnConnectWallet';
import NavMenu from './NavMenu';
import { Session } from 'next-auth';

export default function HeaderMobile({ session }: { session: Session | null }) {
    return (
        <div className={styles.headerMobile}>
            <BtnCampaign type="mobile" />
            <BtnConnectWallet type="mobile" />
            <NavMenu />
        </div>
    );
}
