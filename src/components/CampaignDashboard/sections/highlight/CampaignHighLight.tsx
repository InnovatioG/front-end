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
        <div className={styles.pictureContainer}>
          <Image
            layout="fill"
            objectFit="contain"
            src={LAUNCHED}
            alt="launched-campaings"
            className={styles.imageCard}
            objectPosition={"bottom right"}

          />
        </div>
      </div>
      <div className={styles.card}>
        <svg width="18" height="18" className={styles.icon}>
          <use href={CHART}></use>
        </svg>
        <div className={styles.dataCard}>
          <p className={styles.data}>2.210.000</p>
          <p className={styles.text}>ADA contribuited</p>
        </div>
        <div className={styles.pictureContainer}>
          <Image
            layout="fill"
            objectFit="contain"
            src={CONTRIBUITED}
            alt="Ada-contribuited"
            className={styles.imageCard}
            objectPosition={"bottom right"}

          />
        </div>
      </div>
      <div className={styles.card}>
        <svg width="18" height="18" className={styles.icon}>
          <use href={USER}></use>
        </svg>
        <div className={styles.dataCard}>
          <p className={styles.data}>2361</p>
          <p className={styles.text}>Colaborators</p>
        </div>
        <div className={styles.pictureContainer}>
          <Image
            layout="fill"
            objectFit="contain"
            src={COLABORATORS}
            alt="colaborators"
            className={styles.imageCard}
            objectPosition={"bottom right"}

          />
        </div>
      </div>
    </div>
  )
}
