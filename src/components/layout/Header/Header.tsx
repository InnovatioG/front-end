import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.scss";
import { LOGO_FULL_LIGHT } from "@/utils/images";
import { useScreenSize } from "@/hooks/useScreenSize";
import HeaderMobile from "./HeaderMobile";
import HeaderDesktop from "./HeaderDesktop";
import { useSession } from "next-auth/react";

export default function Header() {
  const screenSize = useScreenSize();
  const { data: session } = useSession();

  return (
    <div className={styles.header}>
      <Link href="/">
        <Image
          height={18}
          width={108}
          src={LOGO_FULL_LIGHT}
          alt="logo-full"
          className={styles.logo}
          priority
        />
      </Link>
      {screenSize === "mobile" || screenSize === "tablet" ? (
        <HeaderMobile session={session} />
      ) : (
        <HeaderDesktop session={session} />
      )}
    </div>
  );
}
