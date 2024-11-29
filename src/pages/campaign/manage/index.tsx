import { useCardano } from "@/contexts/CardanoContext";
import React from "react";
import styles from "./Campaign.module.scss";
import { useSession } from "next-auth/react";
import BtnConnectWallet from "@/components/buttons/connectWallet/BtnConnectWallet";
import { useScreenSize } from "@/hooks/useScreenSize";
import DraftDashboard from "@/components/campaign/draft/DraftDashboard";
import NewDraftDashboard from "@/components/campaign/draft/iair/DraftDashboard";
export default function Home() {
  const { address } = useCardano();
  const { data: session } = useSession();
  const screenSize = useScreenSize();


  console.log("address", address)
  console.log("session", session)

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
              <BtnConnectWallet
                type="primary"
                width={screenSize === "desktop" ? 225 : undefined}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.draftSection}>
          <h2 className={styles.title}>CAMPAIGN MANAGERS</h2>
          <DraftDashboard address={address} />
          <NewDraftDashboard address={address} />
        </div>
      )}
    </>
  );
}
