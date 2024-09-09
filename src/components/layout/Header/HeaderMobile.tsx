import styles from './HeaderMobile.module.scss';
import BtnCampaign from '../../buttons/campaign/BtnCampaign';
import BtnConnectWallet from '../../buttons/connectWallet/BtnConnectWallet';
import NavMenu from './NavMenu';

export default function HeaderMobile() {

  return (
    <div className={styles.headerMobile}>
      <BtnCampaign type='mobile'/>
      <BtnConnectWallet type='mobile' />
      <NavMenu />
    </div>
  )
}
