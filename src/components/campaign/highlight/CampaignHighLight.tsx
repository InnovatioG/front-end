import styles from "./CampaignHighLight.module.scss";
import Image from "next/image";
import {
  CHART,
  COLABORATORS,
  CONTRIBUITED,
  LAUNCHED,
  USER,
  USERS,
} from "@/utils/images";

export default function CampaignHighLight() {
  return (
    <div className={styles.cardSection}>
        <div className={styles.card}>
          <svg width="18" height="18" className={styles.icon}>
            <use href={USERS}></use>
          </svg>
          <div className={styles.dataCard}>
            <p className={styles.data}>620</p>
            <p className={styles.text}>Launched campaigns</p>
          </div>
          <Image
            width={233}
            height={237}
            src={LAUNCHED}
            alt="launched-campaings"
            className={styles.imageCard}
          />
        </div>
        <div className={styles.card}>
          <svg width="18" height="18" className={styles.icon}>
            <use href={CHART}></use>
          </svg>
          <div className={styles.dataCard}>
            <p className={styles.data}>2.210.000</p>
            <p className={styles.text}>ADA contribuited</p>
          </div>
          <Image
            width={190}
            height={232}
            src={CONTRIBUITED}
            alt="Ada-contribuited"
            className={styles.imageCard}
          />
        </div>
        <div className={styles.card}>
          <svg width="18" height="18" className={styles.icon}>
            <use href={USER}></use>
          </svg>
          <div className={styles.dataCard}>
            <p className={styles.data}>2361</p>
            <p className={styles.text}>Colaborators</p>
          </div>
          <Image
            width={295}
            height={282}
            src={COLABORATORS}
            alt="colaborators"
            className={styles.imageCard}
          />
        </div>
      </div>
  )
}
