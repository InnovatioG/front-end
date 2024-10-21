import { useModal } from "@/contexts/ModalContext";
import styles from "./Modals.module.scss";
import { CLOSE_ICON } from "@/utils/images";
import { CARDANO_WALLETS } from "@/utils/constants";
import Image from "next/image";
import { useState, useEffect } from "react";
import { CardanoWallet } from "@/types/ConstantTypes";
import Link from "next/link";
import { isWalletInstalled } from "@/HardCode/walletsInstalled";
import { useCardano } from "@/contexts/CardanoContext";

export const WalletSelectorModal: React.FC = () => {
  const { closeModal } = useModal();
  const { connectWallet, address } = useCardano();

  const [availableWallets, setAvailableWallets] = useState<CardanoWallet[]>([]);
  const [unAvailableWallets, setUnAvailableWallets] = useState<CardanoWallet[]>(
    []
  );

  useEffect(() => {
    const available: CardanoWallet[] = [];
    const unAvailable: CardanoWallet[] = [];

    CARDANO_WALLETS.forEach((wallet) => {
      /*

      TODO: usar la api de windows para las wallet

       */
      if (isWalletInstalled(wallet.wallet)) {
        available.push(wallet);
      } else {
        unAvailable.push(wallet);
      }
    });

    setAvailableWallets(available);
    setUnAvailableWallets(unAvailable);
  }, []);

  useEffect(() => {
    if (address) {
      closeModal();
    }
  }, [address, closeModal]);

  const handleConnectWallet = async (walletName: string) => {
    try {
      await connectWallet(walletName);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  return (
    <div className={styles.modalWalletSelector}>
      <div className={styles.main}>
        <div className={styles.popUp}>
          <section className={styles.headerModal}>
            <svg
              width="32"
              height="32"
              className={styles.icon}
              onClick={closeModal}
            >
              <use href={CLOSE_ICON}></use>
            </svg>
            <h2 className={styles.titleModal}>
              Connect {process.env.NEXT_PUBLIC_CARDANO_NETWORK} Wallet
            </h2>
          </section>
          <section className={styles.bodyModal}>
            <ul className={styles.walletList}>
              {availableWallets.map((wallet) => (
                <li
                  key={wallet.name}
                  className={`${styles.walletItem} ${styles.available}`}
                  onClick={() => handleConnectWallet(wallet.wallet)}
                >
                  <Image
                    width={50}
                    height={50}
                    alt={`${wallet.name} icon`}
                    src={wallet.icon}
                    className={styles.walletIcon}
                  />
                  <span className={styles.walletName}>{wallet.name}</span>
                </li>
              ))}
            </ul>
            <ul className={styles.walletList}>
              {unAvailableWallets.map((wallet) => (
                <Link key={wallet.name} href={wallet.link} target="_blank" rel="noopener noreferrer" passHref>
                <li
                  
                  className={`${styles.walletItem} ${styles.unAvailable}`}
                >
                  <Image
                    width={60}
                    height={60}
                    alt={`${wallet.name} icon`}
                    src={wallet.icon}
                    className={styles.walletIcon}
                  />
                  <div className={styles.walletLine}>
                    <span className={styles.walletName}>{wallet.name}</span>
                    <span className={styles.walletName}>Install</span>
                  </div>
                </li>
                </Link>

              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};
