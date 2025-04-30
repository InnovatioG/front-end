import BtnHeaderCampaignNewOrManage from '@/components/GeneralOK/Buttons/Buttons/BtnHeaderCampaignNewOrManage/BtnHeaderCampaignNewOrManage';
import BtnConnectWallet from '@/components/GeneralOK/Buttons/Buttons/BtnConnectWallet/BtnConnectWallet';
import styles from './HeaderMobile.module.scss';
import NavMenu from './NavMenu';

export default function HeaderMobile() {
    return (
        <div className={styles.headerMobile}>
            <BtnHeaderCampaignNewOrManage type="mobile" />
            <BtnConnectWallet type="mobile" />
            <NavMenu />
        </div>
    );
}
