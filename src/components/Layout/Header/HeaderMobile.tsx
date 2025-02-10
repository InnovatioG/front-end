import BtnCampaign from '@/components/General/Buttons/Campaign/BtnCampaign';
import BtnConnectWallet from '@/components/General/Buttons/ConnectWallet/BtnConnectWallet';
import styles from './HeaderMobile.module.scss';
import NavMenu from './NavMenu';

export default function HeaderMobile() {
    return (
        <div className={styles.headerMobile}>
            <BtnCampaign type="mobile" />
            <BtnConnectWallet type="mobile" />
            <NavMenu />
        </div>
    );
}
