import JSON from '@/HardCode/campaignId.json';
import InvestmentForm from '@/components/Invest/Sections/InvestmentForm/InvestmentForm';
import InvestHeader from '@/components/Invest/Sections/InvestHeader/InvestHeader';

import React, { useEffect } from 'react';
import styles from './InvestPage.module.scss';
import useInvestPage from '@/pages/invest/useInvestPage';
interface InvestPageProps {
    // Define props here
}

const InvestPage: React.FC<InvestPageProps> = (props) => {
    const { campaign } = useInvestPage();
    console.log(campaign);

    return (
        <main className={styles.layout}>
            <InvestHeader title={campaign.name} logo_url={campaign.logo_url !== undefined ? campaign.logo_url : ''} />
            <article>
                {/*       <InvestmentForm
                    cdCampaignToken_PriceADA={cdCampaignToken_PriceADA}
                    cdCampaignToken_TN={cdCampaignToken_TN}
                    cdRequestedMaxADA={cdRequestedMaxADA}
                    goal={goal}
                    id={id ? Number(id) : 0}
                    deliveryDate={start_date}
                /> */}
            </article>
        </main>
    );
};

export default InvestPage;
