import { Session } from 'next-auth';
import BtnCampaign from '../../UI/Buttons/Campaign/BtnCampaign';
import BtnConnectWallet from '../../UI/Buttons/ConnectWallet/BtnConnectWallet';
import styles from './HeaderMobile.module.scss';
import NavMenu from './NavMenu';

export default function HeaderMobile({ session }: { session: Session | null }) {
    return (
        <div className={styles.headerMobile}>
            <BtnCampaign type="mobile" />
            <BtnConnectWallet type="mobile" />
            <NavMenu />
        </div>
    );
}
