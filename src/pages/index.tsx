import Head from 'next/head';
import styles from '@/styles/Home.module.scss';
import Image from 'next/image';
import { PEOPLE } from '@/utils/images';
import CampaignHighLight from '@/components/campaign/highlight/CampaignHighLight';
import CampaignDashboard from '@/components/campaign/dashboard/CampaignDashboard';
import { useEffect, useState } from 'react';
import { TestEntity, CampaignEntity } from '@/lib/SmartDB/Entities';
import { CampaignFrontEndApiCalls } from '@/lib/SmartDB/FrontEnd';
import { TestApi, } from '@/lib/SmartDB/FrontEnd';

export default function Home() {
    const [list, setList] = useState<TestEntity[]>();
    const [error, setError] = useState<unknown>();

    /*     useEffect(() => {
            const fetch = async () => {
                try {
                    const list: TestEntity[] = await TestApi.getAllApi_();
                    setList(list);
                } catch (err) {
                    console.error('Error fetching data:', err);
                    setError(err);
                }
            };
            fetch();
        }, []); */



    const handleCreate = async () => {
        alert('Creating test entity');
        const campaign = new CampaignEntity();
        campaign.projectId = 1;
        campaign.campaignCategoryId = 1;
        campaign.campaignStatusId = 1;
        campaign.creatorWalletId = 1;
        campaign.cdCampaignVersion = 1;
        campaign.cdCampaignPolicy_CS = 'policy_cs';
        campaign.cdCampaignFundsPolicyID_CS = 'funds_policy_id_cs';
        campaign.cdAdmins = ['admin1', 'admin2'];
        campaign.cdTokenAdminPolicy_CS = 'token_admin_policy_cs';
        campaign.cdMint_CampaignToken = true;
        campaign.cdCampaignToken_CS = 'token_cs';
        campaign.cdCampaignToken_TN = 'token_tn';
        campaign.cdCampaignToken_PriceADA = 1;
        campaign.cdRequestedMaxADA = 1000;
        campaign.cdRequestedMinADA = 100;
        campaign.cdFundedADA = 0;
        campaign.cdCollectedADA = 0;
        campaign.cdBeginAt = new Date();
        campaign.cdDeadline = new Date();
        campaign.cdStatus = 'active';
        campaign.cdMilestones = ['milestone1', 'milestone2'];
        campaign.cdFundsCount = 0;
        campaign.cdFundsIndex = 0;
        campaign.cdMinADA = 1;
        campaign.description = 'Test description';
        campaign.logoUrl = 'https://example.com/logo.png';
        campaign.bannerUrl = 'https://example.com/banner.png';
        campaign.website = 'https://example.com';
        campaign.instagram = 'https://instagram.com/example';
        campaign.twitter = 'https://twitter.com/example';
        campaign.discord = 'https://discord.com/example';
        campaign.facebook = 'https://facebook.com/example';
        campaign.investors = 0;
        campaign.featured = false;
        campaign.archived = false;
        campaign.createdAt = new Date();
        campaign.updatedAt = new Date();

        await CampaignFrontEndApiCalls.createApi(campaign);
    };
    const handleUpdate = async () => {
        alert('Update test entity');
        const test: TestEntity | undefined = await TestApi.getOneByParamsApi_({ name: 'Test' });
        if (test !== undefined) {
            test.description = 'Test description updated' + Math.random();
            await TestApi.updateApi(test);
        }
    };

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
            <div>
                {list?.map((item) => (
                    <div key={item._DB_id}>
                        <h1>{item.name}</h1>
                        <h2>{item.description}</h2>
                    </div>
                ))}
            </div>
            <button
                onClick={async () => {
                    handleCreate();
                }}
            >
                Create
            </button>

            <button
                onClick={async () => {
                    handleUpdate();
                }}
            >
                Update
            </button>
        </>
    );
}

