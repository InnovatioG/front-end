import { LOGO } from "@/utils/images";
import styles from "./LoadingPage.module.scss";
import NextImage from "next/image";

export default function LoadingPage() {
  return (
    <div className={styles.loadingPage}>
      <div className={styles.logoContainer}>
        <NextImage src={LOGO} width={50} height={50} alt="logo" priority/>
      </div>
    </div>
  );
}
