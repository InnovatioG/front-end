import Head from 'next/head';
import styles from '@/styles/Home.module.scss';
import Image from 'next/image';
import { PEOPLE } from '@/utils/images';
import CampaignHighLight from '@/components/campaign/highlight/CampaignHighLight';
import CampaignDashboard from '@/components/campaign/dashboard/CampaignDashboard';
import { useEffect, useState } from 'react';
import { TestEntity } from '@/lib/SmartDB/Entities';
import { TestApi } from '@/lib/SmartDB/FrontEnd';

export default function Home() {
    const [list, setList] = useState<TestEntity[]>();
    const [error, setError] = useState<unknown>();

    useEffect(() => {
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
    }, []);

    console.log("error", error);

    const handleCreate = async () => {
        alert('Creating test entity');
        const test = new TestEntity();
        test.name = 'Test';
        test.description = 'Test description';
        await TestApi.createApi(test);
    };

    /*     const handleUpdate = async () => {
            alert('Update test entity');
            const test: TestEntity | undefined = await TestApi.getOneByParamsApi_({ name: 'Test' });
            if (test !== undefined) {
                test.description = 'Test description updated' + Math.random();
                await TestApi.updateApi(test);
            }
        }; */

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

            {/*            <button
                onClick={async () => {
                    handleUpdate();
                }}
            >
                Update
            </button> */}
        </>
    );
}



/* 
<section className={styles.peopleSection}>
<div className={styles.imagenContainer}>
    <Image alt="people" src={PEOPLE}
        width={500} height={500} className={styles.imagePeople} priority layout='fill' objectFit='contain'  />
</div>
</section> */