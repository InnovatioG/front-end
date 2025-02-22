import CampaignsDetails from '@/components/Campaigns/CampaignDetails/CampaignDetails';
import GeneralError from '@/components/General/Errors/GeneralError';
import LoadingPage from '@/components/GeneralOK/LoadingPage/LoadingPage';
import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';
import { PageViewEnums } from '@/utils/constants/routes';
import { CampaignTabEnum, CampaignTabUrls, ROUTES } from '@/utils/constants/routes';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import styles from './[[...query]].module.scss';
import { useWalletStore } from 'smart-db';
import { useResponsive } from '@/contexts/ResponsiveContext';

interface CampaignsDetailsPageProps {
    // Define props here
}

const CampaignsDetailsPage: React.FC<CampaignsDetailsPageProps> = (props) => {
    const isEditMode = false;
    const pageView = PageViewEnums.CAMPAIGNS;

    const router = useRouter();
    const { id, query } = router.query;
    const tabUrl = Array.isArray(query) && query.length > 0 ? query[0] : undefined;
    const tab = Object.entries(CampaignTabUrls).find(([, url]) => url === tabUrl)?.[0] as CampaignTabEnum | undefined;
    const { campaign, isLoading, setIsEditMode, fetchCampaignById, setCampaignTab, campaignTab } = useCampaignIdStore();

    useEffect(() => {
        if (id) {
            const campaignId = id as string;
            setIsEditMode(isEditMode);
            // TODO: checkear si el usuario tiene permisos para buscar esa id
            fetchCampaignById(campaignId);
        }
    }, [id, fetchCampaignById, setIsEditMode, isEditMode]);

    useEffect(() => {
        // tomo tab de url primero y updato store si es diferente
        if (campaign?.campaign?._DB_id !== undefined && tab !== undefined && tab !== campaignTab) {
            setCampaignTab(tab);
            return;
        }
        // tomo tab de store y updato url si es diferente
        if (campaign?.campaign?._DB_id !== undefined && campaignTab !== undefined && tab !== campaignTab) {
            router.replace(ROUTES.campaignDynamicTab(campaign.campaign._DB_id, campaignTab, pageView, isEditMode), undefined, { shallow: true });
        }
    }, [campaign?.campaign?._DB_id, tab, campaignTab, setCampaignTab, router, isEditMode, pageView]);

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
            <div className={styles.draftSection}>
                <CampaignsDetails pageView={pageView} />
            </div>
        );
    }
};

export default CampaignsDetailsPage;
