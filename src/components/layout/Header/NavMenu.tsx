import { useState } from "react";
import styles from "./NavMenu.module.scss";
import { CALENDAR } from "@/utils/images";
import Link from "next/link";
import BtnConnectWallet from "@/components/buttons/connectWallet/BtnConnectWallet";
import BtnCampaign from "@/components/buttons/campaign/BtnCampaign";

export default function NavMenu() {
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);

  const handleClickMenu = () => {
    isOpenMenu ? setIsOpenMenu(false) : setIsOpenMenu(true);
  };

  return (
    <>
      <div className={styles.menu}>
        <nav
          className={`${styles.btnMenu} ${isOpenMenu ? styles.isOpen : ""}`}
          onClick={handleClickMenu}
        >
          <div className={styles.menuLine}></div>
          <div className={styles.menuLine}></div>
          <div className={styles.menuLine}></div>
        </nav>

        <div
          className={`${styles.menuContent} ${isOpenMenu ? styles.isOpen : ""}`}
        >
          <h2 className={styles.menuTitle}>Menu</h2>
          <div className={styles.btnCalendar}>
            <svg width="29" height="29" className={styles.icon}>
              <use href={CALENDAR}></use>
            </svg>
          </div>
          <div className={styles.infoSection}>
            <Link
              href={""}
              className={styles.infoLink}
            >
              <button
                onClick={() => setIsOpenMenu(false)} >

                How it works
              </button>
            </Link>
            <Link
              href={""}
              className={styles.infoLink}
            >
              <button onClick={() => setIsOpenMenu(false)}>
                About us
              </button>
            </Link>
            <Link
              href={"/campaigns"}
              className={styles.infoLink}
            >
              <button >
                Campaigns
              </button>
            </Link>
          </div>
          <div className={styles.btnActions}>
            <div onClick={() => setIsOpenMenu(false)}>
              <BtnConnectWallet type="secondary" width={230} />
            </div>
            <BtnCampaign type="secondary" width={230} closeMenu={() => setIsOpenMenu(false)} />
          </div>
        </div>
      </div>
    </>
  );
}
