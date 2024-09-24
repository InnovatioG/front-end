//import { signIn, useSession, signOut } from "next-auth/react";
import styles from "./GoogleConnect.module.scss";
import Image from "next/image";
import { AVATAR, GOOGLE } from "@/utils/images";
import { useState } from "react";

interface GoogleConnectProps {
  width?: number;
  loggedIn?: boolean;
}

const GoogleConnect: React.FC<GoogleConnectProps> = ({ width, loggedIn }) => {
  //const { data: session } = useSession();
  //const userImage = session?.user?.image || AVATAR;
  const [showDisconnect, setShowDisconnect] = useState<boolean>(false);

/*   const handleSignIn = () => {
    if (session) {
      signOut();
    }
    signIn("google");
  }; */

  if (loggedIn) {
    return (
      <button
        className={styles.btnConnected}
        onClick={() => setShowDisconnect(!showDisconnect)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {/* <img src={userImage} alt="logo-user" className={styles.logo} /> */}
        {/* {showDisconnect && session !== null && (
          <p className={styles.btnDisconnect} onClick={() => signOut()}>
            Disconnect
          </p>
        )} */}
      </button>
    );
  }

  return (
    <div
      className={styles.googleButton}
      /* onClick={handleSignIn} */
      style={width ? { width: `${width}px` } : undefined}
    >
      <Image src={GOOGLE} height={20} width={20} alt="logo-google" />{" "}
      <span className={styles.text}>Sign up with Google</span>
    </div>
  );
};

export default GoogleConnect;
