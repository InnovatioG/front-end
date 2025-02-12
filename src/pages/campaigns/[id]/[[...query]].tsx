import CampaignsDetails from '@/components/Campaigns/CampaignDetails/CampaignDetails';
import GeneralError from '@/components/General/Errors/GeneralError';
import LoadingPage from '@/components/General/LoadingPage/LoadingPage';
import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';
import { CampaignViewForEnums } from '@/utils/constants/constants';
import { CampaignTabEnum, CampaignTabUrls, ROUTES } from '@/utils/constants/routes';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import styles from './[[...query]].module.scss';

interface CampaignsDetailsPageProps {
    // Define props here
}

const CampaignsDetailsPage: React.FC<CampaignsDetailsPageProps> = (props) => {
    const router = useRouter();
    const { id, query } = router.query;
    const tabUrl = Array.isArray(query) && query.length > 0 ? query[0] : undefined;
    const tab = Object.entries(CampaignTabUrls).find(([, url]) => url === tabUrl)?.[0] as CampaignTabEnum | undefined;
    const { campaign, isLoading, setIsLoading, setIsEditMode, fetchCampaignById, setCampaignTab, campaignTab, isEditMode } = useCampaignIdStore();

    useEffect(() => {
        if (id) {
            const campaignId = id as string;
            setIsEditMode(false);
            // TODO: checkear si el usuario tiene permisos para buscar esa id
            fetchCampaignById(campaignId);
        }
    }, [id, fetchCampaignById, setIsEditMode]);

    useEffect(() => {
        // tomo tab de url primero y updato store si es diferente
        if (campaign?.campaign?._DB_id !== undefined && tab !== undefined  && tab !== campaignTab) {
            setCampaignTab(tab);
            return
        }
        // tomo tab de store y updato url si es diferente
        if (campaign?.campaign?._DB_id !== undefined && campaignTab !== undefined && tab !== campaignTab) {
            router.replace(ROUTES.campaignDynamicTab(campaign.campaign._DB_id, campaignTab, CampaignViewForEnums.campaigns, false), undefined, { shallow: true });
        }
    }, [campaign?.campaign?._DB_id, tab, campaignTab, setCampaignTab]);

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
                <CampaignsDetails campaignViewFor={CampaignViewForEnums.campaigns} />
            </div>
        );
    }
};

export default CampaignsDetailsPage;
