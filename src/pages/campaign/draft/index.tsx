import { useCardano } from "@/contexts/CardanoContext";
import React from "react";
import styles from "./Campaign.module.scss";
import GoogleConnect from "@/components/buttons/googleConnect/GoogleConnect";
import { useSession } from "next-auth/react";
import BtnConnectWallet from "@/components/buttons/connectWallet/BtnConnectWallet";
import { useScreenSize } from "@/hooks/useScreenSize";
import DraftDashboard from "@/components/campaign/draft/DraftDashboard";

export default function Home() {
  const { address } = useCardano();
  const { data: session } = useSession();
  const screenSize = useScreenSize();

  return (
    <>
      {address === null && session === null ? (
        <div className={styles.campaignSection}>
          <div className={styles.mainSection}>
            <h2 className={styles.title}>
              In order to continue with the creation process you must register
              with your Google account or connect wallet
            </h2>
            <div className={styles.btns}>
              <GoogleConnect
                width={screenSize === "desktop" ? 225 : undefined}
              />
              <BtnConnectWallet
                type="primary"
                width={screenSize === "desktop" ? 225 : undefined}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.draftSection}>
          <h2 className={styles.title}>Draft</h2>
          <DraftDashboard address={address} />
        </div>
      )}
    </>
  );
}
