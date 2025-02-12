import CampaignsDetails from '@/components/Campaigns/CampaignDetails/CampaignDetails';
import GeneralError from '@/components/General/Errors/GeneralError';
import LoadingPage from '@/components/General/LoadingPage/LoadingPage';
import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';
import { CampaignViewForEnums } from '@/utils/constants/constants';
import { CampaignTabEnum, CampaignTabUrls, ROUTES } from '@/utils/constants/routes';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useWalletStore } from 'smart-db';
import styles from './[[...query]].module.scss';
import BtnConnectWallet from '@/components/GeneralOK/Buttons/Buttons/BtnConnectWallet/BtnConnectWallet';
import { useResponsive } from '@/contexts/ResponsiveContext';

interface CampaignsManageDetailsPageProps {
    // Define props here
}

const CampaignsManageDetailsPage: React.FC<CampaignsManageDetailsPageProps> = (props) => {
    const walletStore = useWalletStore();
    const { screenSize } = useResponsive();
    const title = () => (walletStore.isConnected && walletStore.isCoreTeam() ? 'PROTOCOL TEAM MANAGEMENT' : 'CAMPAIGN MANAGEMENT');

    const router = useRouter();
    const { id, query } = router.query;
    const tabUrl = Array.isArray(query) && query.length > 0 ? query[0] : undefined;
    const tab = Object.entries(CampaignTabUrls).find(([, url]) => url === tabUrl)?.[0] as CampaignTabEnum | undefined;
    const { campaign, isLoading, setIsEditMode, fetchCampaignById, setCampaignTab, campaignTab } = useCampaignIdStore();

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
               router.replace(ROUTES.campaignDynamicTab(campaign.campaign._DB_id, campaignTab, CampaignViewForEnums.manage, false), undefined, { shallow: true });
           }
       }, [campaign?.campaign?._DB_id, tab, campaignTab, setCampaignTab]);

    if (walletStore.isConnected === false || walletStore.info?.isWalletValidatedWithSignedToken === false) {
        return (
            <div className={styles.campaignSection}>
                <div className={styles.mainSection}>
                    <h2 className={styles.title}>In order to continue with the management process you must connect wallet in Admin Mode</h2>
                    <div className={styles.btns}>
                        <BtnConnectWallet type="primary" width={screenSize === 'desktop' ? 225 : undefined} />
                    </div>
                </div>
            </div>
        );
    } else if (isLoading === true) {
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
                {/* <h2 className={styles.title}>{title()}</h2> */}
                <CampaignsDetails campaignViewFor={CampaignViewForEnums.manage} />
            </div>
        );
    }
};

export default CampaignsManageDetailsPage;
