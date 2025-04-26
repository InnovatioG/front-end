import GeneralError from '@/components/General/Errors/GeneralError';
import LoadingPage from '@/components/GeneralOK/LoadingPage/LoadingPage';
import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';
import { CampaignTabEnum, CampaignTabUrls } from '@/utils/constants/routes';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import styles from './InvestPage.module.scss';
import InvestHeader from '@/components/Campaigns/Invest/Sections/InvestHeader/InvestHeader';
import InvestmentForm from '@/components/Campaigns/Invest/Sections/InvestmentForm/InvestmentForm';

interface CampaignsInvestDetailsPageProps {
    // Define props here
}

const CampaignsInvestDetailsPage: React.FC<CampaignsInvestDetailsPageProps> = (props) => {
    const router = useRouter();
    const { id, query } = router.query;
    const tabUrl = Array.isArray(query) && query.length > 0 ? query[0] : undefined;
    const tab = Object.entries(CampaignTabUrls).find(([, url]) => url === tabUrl)?.[0] as CampaignTabEnum | undefined;
    const { campaign, isLoading, setIsLoading, setIsEditMode, fetchCampaignById, setCampaignTab } = useCampaignIdStore();

    useEffect(() => {
        if (id) {
            const campaignId = id as string;
            setIsEditMode(false);
            // TODO: checkear si el usuario tiene permisos para buscar esa id
            fetchCampaignById(campaignId);
        }
    }, [id, fetchCampaignById, setIsEditMode]);

    useEffect(() => {
        setCampaignTab(tab ?? CampaignTabEnum.DETAILS);
    }, [tab, setCampaignTab]);

    if (isLoading === true) {
        return (
            <div>
                <LoadingPage />
            </div>
        );
    } else if (campaign === undefined) {
        return (
            <div>
                <GeneralError message="Campaign not found" />
            </div>
        );
    } else {
        return (
            <div>
                <main className={styles.layout}>
                    <InvestHeader />
                    <article>
                        <InvestmentForm />
                    </article>
                </main>
            </div>
        );
    }
};

export default CampaignsInvestDetailsPage;
