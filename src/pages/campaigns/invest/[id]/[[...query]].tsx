import CampaignsDetails from '@/components/Campaigns/CampaignDetails/CampaignDetails';
import GeneralError from '@/components/General/Errors/GeneralError';
import LoadingPage from '@/components/GeneralOK/LoadingPage/LoadingPage';
import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';
import { PageViewEnums } from '@/utils/constants/routes';
import { CampaignTabEnum, CampaignTabUrls } from '@/utils/constants/routes';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

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
                INVEST
                {/* <CampaignsDetails pageView={PageViewEnums.campaigns} /> */}
            </div>
        );
    }
};

export default CampaignsInvestDetailsPage;
