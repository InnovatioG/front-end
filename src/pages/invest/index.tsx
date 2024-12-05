import React, { useEffect } from 'react';
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
import InvestHeader from '@/components/invest/InvestHeader';
import styles from "./InvestPage.module.scss";
import InvestmentForm from '@/components/invest/Form';

interface InvestPageProps {
    // Define props here
}

const InvestPage: React.FC<InvestPageProps> = (props) => {


    const project = localStorage.getItem('project') ? JSON.parse(localStorage.getItem('project') as string) : null;
    const { fetchAdaPrice } = useProjectDetailStore();
    const { cdCampaignToken_TN, cdRequestedMaxADA, cdCampaignToken_PriceADA, goal, id, start_date, title, logoUrl } = project;


    console.log("project", project.logoUrl)

    useEffect(() => {
        fetchAdaPrice();
    }, [fetchAdaPrice]);

    return (
        <main className={styles.layout}>
            <InvestHeader title={project.title} logoUrl={project.logoUrl} />
            <article>
                <InvestmentForm
                    cdCampaignToken_PriceADA={cdCampaignToken_PriceADA}
                    cdCampaignToken_TN={cdCampaignToken_TN}
                    cdRequestedMaxADA={cdRequestedMaxADA}
                    goal={goal}
                    id={id}
                    deliveryDate={start_date}
                />
            </article>
        </main>
    );
}

export default InvestPage;