import Head from 'next/head';
import styles from '@/styles/Home.module.scss';
import Image from 'next/image';
import { PEOPLE } from '@/utils/images';
import CampaignHighLight from '@/components/CampaignDashboard/Sections/Highlight/CampaignHighLight';
import CampaignDashboard from '@/components/CampaignDashboard/Sections/Dashboard/CampaignDashboard';
import { useEffect, useState } from 'react';
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
export default function Home() {

    const { fetchAdaPrice } = useProjectDetailStore();

    useEffect(() => {
        fetchAdaPrice();
    }, [fetchAdaPrice]);

    return (
        <>
            <Head>
                <title>Innovatio App | Home</title>
                <meta name="description" content="Explore crowdfunding campaigns, invest in projects, and help make ideas a reality. Join Innovatio today." />
            </Head>
            <main className={styles.main}>
                <section className={styles.titleSection}>
                    <h1 className={styles.mainTitle}>Invest and found</h1>
                    <h5 className={styles.subTitle}>
                        Help different crowdfunding campaigns become a reality thanks to your contributions, invest in projects, fund purposes and get rewards.
                    </h5>
                </section>
                <div className={styles.peopleContainer}>
                    <div className={styles.pictureContainer}>
                        <Image alt="people" src={PEOPLE}
                            priority layout='fill' objectFit='contain' />
                    </div>
                </div>
            </main>
            <CampaignHighLight />
            <CampaignDashboard />

        </>
    );
}

