import styles from './HeaderMobile.module.scss';
import BtnCampaign from '../../UI/Buttons/Campaign/BtnCampaign';
import BtnConnectWallet from '../../UI/Buttons/ConnectWallet/BtnConnectWallet';
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
