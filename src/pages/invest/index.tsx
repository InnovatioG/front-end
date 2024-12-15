import React, { useEffect } from 'react';
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
import InvestHeader from '@/components/invest/InvestHeader';
import styles from "./InvestPage.module.scss";
import InvestmentForm from '@/components/invest/Form';
import { useRouter } from 'next/router';
import JSON from "@/HardCode/campaignId.json";
import LoadingPage from '@/components/LoadingPage/LoadingPage';
interface InvestPageProps {
    // Define props here
}

const InvestPage: React.FC<InvestPageProps> = (props) => {

    const router = useRouter();

    const { id } = router.query;
    const { setProject, project, setIsLoading, isLoading, setMenuView, setEditionMode, fetchAdaPrice } = useProjectDetailStore();


    const fetchCampaign = () => {
        setIsLoading(true);
        setEditionMode(true);
        fetchAdaPrice();

        if (id) {
            const campaignId = Number(id);
            const campaign: any = JSON.campaigns.find((camp) => camp.id === campaignId);

            if (campaign) {
                setProject(campaign);
            }
        }

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    };

    const { } = useProjectDetailStore();
    const { cdCampaignToken_TN, cdRequestedMaxADA, cdCampaignToken_PriceADA, goal, start_date, title, logoUrl } = project;



    useEffect(() => {
        fetchAdaPrice();
        fetchCampaign();
    }, [fetchAdaPrice, fetchCampaign, id]);




    return (
        <main className={styles.layout}>
            <InvestHeader title={project.title} logoUrl={project.logoUrl} />
            <article>
                <InvestmentForm
                    cdCampaignToken_PriceADA={cdCampaignToken_PriceADA}
                    cdCampaignToken_TN={cdCampaignToken_TN}
                    cdRequestedMaxADA={cdRequestedMaxADA}
                    goal={goal}
                    id={id ? Number(id) : 0}
                    deliveryDate={start_date}
                />
            </article>
        </main>
    );
}

export default InvestPage;