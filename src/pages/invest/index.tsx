import JSON from '@/HardCode/campaignId.json';
import InvestmentForm from '@/components/Invest/Sections/Form';
import InvestHeader from '@/components/Invest/Sections/InvestHeader';
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import styles from './InvestPage.module.scss';
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
            const campaign_id = Number(id);
            const campaign: any = JSON.campaigns.find((camp) => camp.id === campaign_id);

            if (campaign) {
                setProject(campaign);
            }
        }

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    };

    const {} = useProjectDetailStore();
    const { cdCampaignToken_TN, cdRequestedMaxADA, cdCampaignToken_PriceADA, goal, start_date, title, logo_url } = project;

    useEffect(() => {
        fetchAdaPrice();
        fetchCampaign();
    }, [fetchAdaPrice, fetchCampaign, id]);

    return (
        <main className={styles.layout}>
            <InvestHeader title={project.title} logo_url={project.logo_url} />
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
};

export default InvestPage;
