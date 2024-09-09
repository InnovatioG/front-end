import Head from "next/head";
import styles from "@/styles/Home.module.scss";
import Image from "next/image";
import {
  PEOPLE,
} from "@/utils/images";
import CampaignHighLight from "@/components/campaign/highlight/CampaignHighLight";
import CampaignDashboard from "@/components/campaign/dashboard/CampaignDashboard";

export default function Home() {
  return (
    <>
      <Head>
        <title>Innovatio App | Home</title>
      </Head>
      <main className={styles.main}>
        <section className={styles.titleSection}>
          <h1 className={styles.mainTitle}>Invest and found</h1>
          <h5 className={styles.subTitle}>
            Help different crowdfunding campaigns become a reality thanks to
            your contributions, invest in projects, fund purposes and get
            rewards.
          </h5>
        </section>
        <section className={styles.peopleSection}>
          <Image
            width={1000}
            height={1070}
            alt="people"
            src={PEOPLE}
            className={styles.imagePeople}
            priority
          />
        </section>
      </main>
      <CampaignHighLight />
      <CampaignDashboard />
    </>
  );
}

