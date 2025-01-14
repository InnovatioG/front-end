import JSON from '@/HardCode/campaignId.json';
import InvestmentForm from '@/components/Invest/Sections/InvestmentForm/InvestmentForm';
import InvestHeader from '@/components/Invest/Sections/InvestHeader/InvestHeader';
import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import styles from './InvestPage.module.scss';
interface InvestPageProps {
    // Define props here
}

const InvestPage: React.FC<InvestPageProps> = (props) => {
    const router = useRouter();

    const { id } = router.query;
    const { setCampaign, campaign, setIsLoading, isLoading, setMenuView, setEditionMode } = useCampaignIdStore();

    const fetchCampaign = () => {
        setIsLoading(true);
        setEditionMode(true);

        if (id) {
            const campaign_id = Number(id);
            const campaign: any = JSON.campaigns.find((camp) => camp.id === campaign_id);

            if (campaign) {
                setCampaign(campaign);
            }
        }

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    };

    const { } = useCampaignIdStore();
    /*     const { cdCampaignToken_TN, cdRequestedMaxADA, cdCampaignToken_PriceADA, goal, start_date, name, logo_url } = campaign;
     */
    useEffect(() => {
        fetchCampaign();
    }, [fetchCampaign, id]);

    return (
        <main className={styles.layout}>
            {/*      <InvestHeader title={campaign.name} logo_url={campaign.logo_url !== undefined ? campaign.logo_url : logo_url} />
            <article>
                <InvestmentForm
                    cdCampaignToken_PriceADA={cdCampaignToken_PriceADA}
                    cdCampaignToken_TN={cdCampaignToken_TN}
                    cdRequestedMaxADA={cdRequestedMaxADA}
                    goal={goal}
                    id={id ? Number(id) : 0}
                    deliveryDate={start_date}
                />
            </article> */}
        </main>
    );
};

export default InvestPage;
