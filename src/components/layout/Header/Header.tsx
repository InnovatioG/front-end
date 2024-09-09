import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.scss";
import { LOGO_FULL_LIGHT } from "@/utils/images";
import { useScreenSize } from "@/hooks/useScreenSize";
import HeaderMobile from "./HeaderMobile";
import HeaderDesktop from "./HeaderDesktop";

export default function Header() {
  const screenSize = useScreenSize();

  return (
    <div className={styles.header}>
      <Link href="/">
        <Image
          height={18}
          width={108}
          src={LOGO_FULL_LIGHT}
          alt="logo-full"
          className={styles.logo}
        />
      </Link>
      {screenSize === "mobile" || screenSize === "tablet" ? (
        <HeaderMobile />
      ) : (
        <HeaderDesktop />
      )}
    </div>
  );
}
