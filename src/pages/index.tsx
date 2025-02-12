import CampaignsDashboard from '@/components/Campaigns/CampaignsDashboard/CampaignsDashboard';
import CampaignsHighlights from '@/components/Campaigns/CampaignsHighlights/CampaignsHighlights';
import styles from '@/styles/Home.module.scss';
import { CampaignViewForEnums } from '@/utils/constants/constants';
import { PEOPLE } from '@/utils/constants/images';
import Head from 'next/head';
import Image from 'next/image';

export default function Index() {
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
                        <Image alt="people" src={PEOPLE} priority layout="fill" objectFit="contain" />
                    </div>
                </div>
            </main>
            <CampaignsHighlights />
            <CampaignsDashboard campaignViewFor={CampaignViewForEnums.home} />
        </>
    );
}
