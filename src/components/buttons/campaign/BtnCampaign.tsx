import Link from "next/link";
import styles from "./BtnCampaign.module.scss";
import { PLUS_ICON } from "@/utils/images";
import { ROUTES } from "@/utils/routes";

interface BtnCampaignProps {
  type: "mobile" | "primary" | "secondary";
  width?: number;
  closeMenu?: () => void;
}

interface SubComponentProps {
  width?: number;
  closeMenu?: () => void;
}

const BtnCampaignMobile: React.FC<SubComponentProps> = () => {
  return (
    <Link href={ROUTES.draft} className={styles.btnCampaignMob}>
      <svg width="24" height="24" className={styles.icon}>
        <use href={PLUS_ICON}></use>
      </svg>
    </Link>
  );
};

const BtnCampaignPrimary: React.FC<SubComponentProps> = ({ width }) => {
  return (
    <Link
      href={ROUTES.draft}
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

const BtnCampaignSecondary: React.FC<SubComponentProps> = ({ width, closeMenu }) => {
  return (
    <Link
      href={ROUTES.draft}
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
  switch (type) {
    case "mobile":
      return <BtnCampaignMobile />;
    case "primary":
      return <BtnCampaignPrimary width={width} />;
    case "secondary":
      return <BtnCampaignSecondary width={width} closeMenu={closeMenu}/>;
    default:
      return null;
  }
};

export default BtnCampaign;
