import Link from "next/link";
import styles from "./HeaderDesktop.module.scss";
import BtnCampaign from "@/components/buttons/campaign/BtnCampaign";
import BtnConnectWallet from "@/components/buttons/connectWallet/BtnConnectWallet";
import { CALENDAR } from "@/utils/images";

export default function HeaderDesktop() {
  return (
    <div className={styles.headerDesktop}>
      <nav className={styles.navSection}>
        <Link href={""} className={styles.infoLink}>
          How it works
        </Link>
        <Link href={""} className={styles.infoLink}>
          About us
        </Link>
        <Link href={""} className={styles.infoLink}>
          Help with the Campaign
        </Link>
      </nav>
      <div className={styles.btnSection}>
        <div className={styles.btnCalendar}>
          <svg width="29" height="29" className={styles.icon}>
            <use href={CALENDAR}></use>
          </svg>
        </div>
        <BtnCampaign type="primary" width={230} />
        <BtnConnectWallet type="primary" width={166} />
      </div>
    </div>
  );
}
