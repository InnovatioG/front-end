import CampaignsCreation from '@/components/Campaigns/CampaignCreation/CampaignsCreation';
import BtnConnectWallet from '@/components/GeneralOK/Buttons/Buttons/BtnConnectWallet/BtnConnectWallet';
import LoadingPage from '@/components/GeneralOK/LoadingPage/LoadingPage';
import { useResponsive } from '@/contexts/ResponsiveContext';
import { CampaignEntity, MilestoneEntity } from '@/lib/SmartDB/Entities';
import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';
import { useGeneralStore } from '@/store/generalStore/useGeneralStore';
import { MilestoneEX } from '@/types/types';
import { getCampaignEX, getCampaignStatus_Db_Id_By_Code_Id, getMilestoneStatus_Db_Id_By_Code_Id } from '@/utils/campaignHelpers';
import { REQUESTED_DEFAULT_ADA, REQUESTED_MAX_ADA, REQUESTED_MIN_PERCENTAGE_FROM_MAX } from '@/utils/constants/constants';
import { CampaignStatus_Code_Id_Enums, MilestoneStatus_Code_Id_Enums } from '@/utils/constants/status/status';
import React, { useEffect } from 'react';
import { strToHex, toJson, useWalletStore } from 'smart-db';
import styles from './index.module.scss';
import { CAMPAIGN_TOKEN_DEFAULT_TN_Str } from '@/utils/constants/on-chain';

interface CampaignsCreationPageProps {
    // Define props here
}

const CampaignsCreationPage: React.FC<CampaignsCreationPageProps> = (props) => {
    const walletStore = useWalletStore();
    const { screenSize } = useResponsive();
    const {
        campaign,
        isLoading: isLoadingStore,
        setIsLoading: setIsLoadingStore,
        setIsEditMode,
        fetchCampaignById,
        setCampaignTab,
        campaignTab,
        setCampaignEX,
    } = useCampaignIdStore();

    const { wallet } = useGeneralStore();

    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    useEffect(() => {
        setIsLoading(false);
        setIsLoadingStore(true);
        setCampaignEX(undefined);
    }, []);

    useEffect(() => {
        const fetch = async () => {
            setIsEditMode(true);
            const campaign = new CampaignEntity();
            // const now = new Date();

            campaign.campaign_category_id = '';

            campaign.campaign_status_id = getCampaignStatus_Db_Id_By_Code_Id(CampaignStatus_Code_Id_Enums.CREATED);
            campaign.creator_wallet_id = wallet!._DB_id;
            campaign.name = '';
            campaign.description = '';
            campaign.begin_at_days = 0;
            campaign.deadline_days = 90;
            campaign.campaign_deployed_date = undefined;
            campaign.campaign_actived_date = undefined;
            campaign.begin_at = undefined;
            campaign.deadline = undefined;

            campaign.mint_CampaignToken = true;
            campaign.campaignToken_CS = '';
            campaign.campaignToken_TN = strToHex(CAMPAIGN_TOKEN_DEFAULT_TN_Str);
            campaign.campaignToken_PriceADA = 0n;
            campaign.requestedMaxADA = REQUESTED_DEFAULT_ADA;
            campaign.requestedMinADA = BigInt(Number(REQUESTED_DEFAULT_ADA) * REQUESTED_MIN_PERCENTAGE_FROM_MAX);

            campaign.logo_url = '';
            campaign.banner_url = '';
            campaign.website = '';
            campaign.instagram = '';
            campaign.twitter = '';
            campaign.discord = '';
            campaign.linkedin = '';
            campaign.facebook = '';
            campaign.visualizations = 0;
            campaign.investors = 0;
            campaign.tokenomics_max_supply = REQUESTED_MAX_ADA;
            campaign.tokenomics_for_campaign = REQUESTED_MAX_ADA;
            campaign.tokenomics_description = '';

            campaign._isDeployed = false;

            const campaignEX = await getCampaignEX(campaign);

            const newMilestone = new MilestoneEntity();
            newMilestone.campaign_id = campaignEX.campaign._DB_id;
            newMilestone.milestone_status_id = getMilestoneStatus_Db_Id_By_Code_Id(MilestoneStatus_Code_Id_Enums.NOT_STARTED);
            newMilestone.percentage = 100; // Distribute percentage evenly
            newMilestone.estimate_delivery_days = 28;
            newMilestone.order = 1;
            const newMilestoneEX: MilestoneEX = { milestone: newMilestone };

            campaignEX.campaign_submissions = [];
            campaignEX.campaign_submissions_deleted = []; // Track deleted

            campaignEX.milestones = [newMilestoneEX];
            campaignEX.milestones_deleted = [];

            campaignEX.contents = [];
            campaignEX.contents_deleted = [];

            campaignEX.members = [];
            campaignEX.members_deleted = [];

            campaignEX.faqs = [];
            campaignEX.faqs_deleted = [];

            campaignEX.files_to_delete = [];

            setCampaignEX(campaignEX);

            setIsLoadingStore(false);
        };
        if (wallet !== undefined) {
            fetch();
        }
    }, [wallet, setCampaignEX, setIsEditMode]);

    // const title = () => (walletStore.isConnected && walletStore.isCoreTeam() ? 'PROTOCOL TEAM' : 'CAMPAIGN MANAGER');

    return (
        <>
            {isLoading === true || (isLoadingStore === true && wallet !== undefined) ? (
                <>
                    <LoadingPage />
                </>
            ) : walletStore.isConnected === false || (walletStore.info?.isWalletValidatedWithSignedToken === false && wallet === undefined) ? (
                <div className={styles.campaignSection}>
                    <div className={styles.mainSection}>
                        <h2 className={styles.title}>In order to continue with the creation process you must connect wallet in Admin Mode</h2>
                        <div className={styles.btns}>
                            <BtnConnectWallet type="primary" width={screenSize === 'desktop' ? 225 : undefined} />
                        </div>
                    </div>
                </div>
            ) : campaign !== undefined && isLoading === false ? (
                <CampaignsCreation />
            ) : null}
        </>
    );
};

export default CampaignsCreationPage;
