import CampaignsDetails from '@/components/Campaigns/CampaignDetails/CampaignDetails';
import GeneralError from '@/components/General/Errors/GeneralError';
import LoadingPage from '@/components/General/LoadingPage/LoadingPage';
import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';
import { CampaignTab, CampaignTabUrls } from '@/utils/constants/routes';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface CampaignsDetailsPageProps {
    // Define props here
}

const CampaignsDetailsPage: React.FC<CampaignsDetailsPageProps> = (props) => {
    const router = useRouter();
    const { id, query } = router.query;
    const tabUrl = Array.isArray(query) && query.length > 0 ? query[0] : undefined;
    const tab = Object.entries(CampaignTabUrls).find(([, url]) => url === tabUrl)?.[0] as CampaignTab | undefined;

    const { campaign, isLoading, setIsLoading, setIsAdmin, setEditionMode, fetchCampaignById, setMenuView } = useCampaignIdStore();

    useEffect(() => {
        if (id) {
            const campaignId = id as string;
            setEditionMode(false);
            // TODO: checkear si el usuario tiene permisos para buscar esa id
            fetchCampaignById(campaignId);
        }
    }, [id, fetchCampaignById, setEditionMode]);

    useEffect(() => {
        setMenuView(tab ?? CampaignTab.DETAILS);
    }, [tab, setMenuView]);

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
                <CampaignsDetails />
            </div>
        );
    }
};

export default CampaignsDetailsPage;
