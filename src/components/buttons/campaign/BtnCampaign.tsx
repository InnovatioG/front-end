import Link from "next/link";
import styles from "./BtnCampaign.module.scss";
import { PLUS_ICON } from "@/utils/images";
import { ROUTES } from "@/utils/routes";
import { useRouter } from "next/router";

interface BtnCampaignProps {
  type: "mobile" | "primary" | "secondary";
  width?: number;
  closeMenu?: () => void;
}

interface SubComponentProps {
  width?: number;
  closeMenu?: () => void;
  dir: string;
}

const BtnCampaignMobile: React.FC<SubComponentProps> = ({ dir }) => {
  return (
    <Link href={dir} className={styles.btnCampaignMob}>
      <svg width="24" height="24" className={styles.icon}>
        <use href={PLUS_ICON}></use>
      </svg>
    </Link>
  );
};

const BtnCampaignPrimary: React.FC<SubComponentProps> = ({ width, dir }) => {
  return (
    <Link
      href={dir}
      className={styles.BtnCampaignPrimary}
      style={width ? { width: `${width}px` } : undefined}
    >
      <svg width="24" height="24" className={styles.icon}>
        <use href={PLUS_ICON}></use>
      </svg>
      <p className={styles.text}>Start new campaign</p>
    </Link>
  );
};

const BtnCampaignSecondary: React.FC<SubComponentProps> = ({ width, closeMenu, dir }) => {
  return (
    <Link
      href={dir}
      className={styles.btnCampaignSecondary}
      style={width ? { width: `${width}px` } : undefined}
      onClick={closeMenu}
    >
      <svg width="24" height="24" className={styles.icon}>
        <use href={PLUS_ICON}></use>
      </svg>
      <p className={styles.text}>Start new campaign</p>
    </Link>
  );
};

const BtnCampaign: React.FC<BtnCampaignProps> = ({ type, width, closeMenu }) => {
  const router = useRouter();
  const direction: string = router.pathname !== ROUTES.draft ? ROUTES.draft : ROUTES.new;
  switch (type) {
    case "mobile":
      return <BtnCampaignMobile dir = {direction}/>;
    case "primary":
      return <BtnCampaignPrimary width={width} dir = {direction}/>;
    case "secondary":
      return <BtnCampaignSecondary width={width} closeMenu={closeMenu} dir = {direction}/>;
    default:
      return null;
  }
};

export default BtnCampaign;
