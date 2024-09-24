import styles from "./HeaderMobile.module.scss";
import BtnCampaign from "../../buttons/campaign/BtnCampaign";
import BtnConnectWallet from "../../buttons/connectWallet/BtnConnectWallet";
import NavMenu from "./NavMenu";
import { Session } from "next-auth";
import GoogleConnect from "@/components/buttons/googleConnect/GoogleConnect";

export default function HeaderMobile({ session }: { session: Session | null }) {
  return (
    <div className={styles.headerMobile}>
      <BtnCampaign type="mobile" />
      {session === null ? (
        <BtnConnectWallet type="mobile" />
      ) : (
        <GoogleConnect loggedIn={true} />
      )}

      <NavMenu />
    </div>
  );
}
