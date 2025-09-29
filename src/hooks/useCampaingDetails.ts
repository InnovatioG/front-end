import { useModal } from '@/contexts/ModalContext';
import { CampaignEntity } from '@/lib/SmartDB/Entities';
import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';
import { useGeneralStore } from '@/store/generalStore/useGeneralStore';
import { CampaignEX } from '@/types/types';
import { CampaignStatusConfigs, campaignStatusConfigs } from '@/utils/campaignConfigs';
import {
    serviceApproveCampaign,
    serviceApproveMilestone,
    serviceArchiveCampaign,
    serviceCollect,
    serviceCreateSmartContracts,
    serviceDeleteCampaign,
    serviceFailMilestone,
    serviceFeatureCampaign,
    serviceGetBack,
    serviceInitializeCampaign,
    serviceInvest,
    serviceLaunchCampaign,
    servicePrepareUTxOs,
    servicePublishSmartContracts,
    serviceRejectCampaign,
    serviceRejectMilestone,
    serviceSaveCampaign,
    serviceSubmitCampaign,
    serviceSubmitMilestone,
    serviceUnArchiveCampaign,
    serviceUnFeatureCampaign,
    serviceValidateFundraisingStatus,
} from '@/utils/campaignServices';
import { HandlesEnums, ModalsEnums } from '@/utils/constants/constants';
import { PageViewEnums, ROUTES } from '@/utils/constants/routes';
import { CampaignStatus_Code_Id_Enums } from '@/utils/constants/status/status';
import { calculatePercentageValue, getOrdinalString, getTimeRemaining } from '@/utils/formats';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { TimeApi, toJson, useAppStore, useTransactions, useWalletStore } from 'smart-db';
import { getCampaignCategory_Name_By_Db_Id, getCampaignStatus_Code_Id_By_Db_Id, getCurrentMilestoneEXIndex, getMilestoneStatus_Code_Id_By_Db_Id } from '../utils/campaignHelpers';

export interface ICampaignDetails extends CampaignStatusConfigs {
    handles: Partial<Record<HandlesEnums, (data?: Record<string, any>) => Promise<string | boolean | undefined | void | boolean>>>;
    isAdmin: boolean;
    isEditor: boolean;
    isProtocolTeam: boolean;
    pageView: PageViewEnums;
    campaign_category_name: string;
    campaign_status_code_id: number;
    timeRemainingBeginAt: { total: number; days: number; totalHours: number; minutes: number };
    timeRemainingDeadline: { total: number; days: number; totalHours: number; minutes: number };
    currentMilestone_status_code_id: number | undefined;
    currentMilestoneIndex: number | undefined;
    currentMilestoneString: string;
    currentMilestoneStringOrdinal: string;
    totalMilestones: number;
    fundedPercentage: string;
    requestedMinPercentage: string;
    progressWidth: string;
}

interface useCampaignDetailsProps {
    campaign: CampaignEX;
    pageView: PageViewEnums;
    isEditMode: boolean;
    setCampaignEX?: (campaignEX: CampaignEX | undefined) => void;
    setCampaign?: (campaign: CampaignEntity) => void;
    fetchCampaignsEX?: () => Promise<void>;
    isValidEdit?: boolean;
    setIsValidEdit?: (isValidEdit: boolean) => void;
}

export const useCampaignDetails = ({
    campaign,
    pageView,
    isEditMode,
    setCampaignEX,
    setCampaign,
    fetchCampaignsEX,
    isValidEdit,
    setIsValidEdit,
}: useCampaignDetailsProps): ICampaignDetails => {
    //----------------------------------------------
    const appStore = useAppStore();
    const walletStore = useWalletStore();
    //--------------------------------------
    const { openModal } = useModal();
    //--------------------------------------
    const router = useRouter();
    //--------------------------------------
    const { wallet, isProtocolTeam, _DebugIsAdmin, _DebugIsEditor, campaignStatus, milestoneStatus, submissionStatus, protocol, refreshHaveCampaigns } = useGeneralStore();
    const { isLoading, setIsEditMode, fetchCampaignById, setCampaignTab, campaignTab } = useCampaignIdStore();
    //----------------------------------------------
    // States
    const [serverTime, setServerTime] = useState<number | undefined>();
    const { requestedMaxADA, requestedMinADA, fundedADA } = useMemo(() => campaign.campaign, [campaign]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isEditor, setIsEditor] = useState(false);
    const campaign_category_name = useMemo(() => getCampaignCategory_Name_By_Db_Id(campaign.campaign.campaign_category_id), [campaign]);
    const campaign_status_code_id = useMemo(() => getCampaignStatus_Code_Id_By_Db_Id(campaign.campaign.campaign_status_id), [campaign]);
    const totalMilestones = useMemo(() => (campaign.milestones ? campaign.milestones.length : 0), [campaign]);
    const currentMilestoneIndex = useMemo(() => getCurrentMilestoneEXIndex(campaign.milestones), [campaign]);
    const milestone_status_code_id =
        currentMilestoneIndex === undefined ? undefined : getMilestoneStatus_Code_Id_By_Db_Id(campaign.milestones![currentMilestoneIndex].milestone.milestone_status_id);
    const [timeRemainingBeginAt, setTimeRemainingBeginAt] = useState(getTimeRemaining(serverTime, campaign.campaign.begin_at));
    const [timeRemainingDeadline, setTimeRemainingDeadline] = useState(getTimeRemaining(serverTime, campaign.campaign.deadline));
    const fundedPercentage = useMemo(() => calculatePercentageValue(requestedMaxADA, Number(fundedADA)), [requestedMaxADA, fundedADA]);
    const requestedMinPercentage = useMemo(() => calculatePercentageValue(requestedMaxADA, requestedMinADA), [requestedMinADA, requestedMaxADA]);
    const progressWidth = useMemo(() => `${fundedPercentage}%`, [fundedPercentage]);
    //----------------------------------------------
    // Effects

    const fetchServerTime = async () => {
        try {
            const now = await TimeApi.getServerTimeApi();
            setServerTime(now);
        } catch (error) {
            console.error('Error fetching time:', error);
        }
    };
    useEffect(() => {
        fetchServerTime();
    }, []);
    //----------------------------------------------

    useEffect(() => {
        console.log('useCampaignDetails - useEffect', walletStore.isConnected, walletStore.info, wallet, campaign, _DebugIsAdmin, _DebugIsEditor);
        //TODO: revisar mejor como saber si es admin o es editor de una campana
        if (_DebugIsAdmin !== undefined) {
            setIsAdmin(_DebugIsAdmin);
        } else {
            setIsAdmin(
                walletStore.isConnected === true &&
                    walletStore.info?.isWalletValidatedWithSignedToken === true &&
                    wallet !== undefined &&
                    campaign.campaign.creator_wallet_id === wallet._DB_id
            );
        }
        if (_DebugIsEditor !== undefined) {
            setIsEditor(_DebugIsEditor);
        } else {
            setIsEditor(
                walletStore.isConnected === true &&
                    walletStore.info?.isWalletValidatedWithSignedToken === true &&
                    wallet !== undefined &&
                    campaign.campaign.creator_wallet_id === wallet._DB_id
            );
        }
    }, [walletStore.isConnected, walletStore.info, wallet, campaign, _DebugIsAdmin, _DebugIsEditor]);

    useEffect(() => {
        // TODO: use server time
        // Don't set up any timers if we don't have the necessary date
        const isCountdown = campaign_status_code_id === CampaignStatus_Code_Id_Enums.COUNTDOWN;
        const isFundraising = campaign_status_code_id === CampaignStatus_Code_Id_Enums.FUNDRAISING;
        // Determine which date to use for the timer
        let targetDate = undefined;
        if (isCountdown && campaign.campaign.begin_at && campaign.campaign.begin_at.getTime() > 0) {
            targetDate = campaign.campaign.begin_at;
        } else if (isFundraising && campaign.campaign.deadline && campaign.campaign.deadline.getTime() > 0) {
            targetDate = campaign.campaign.deadline;
        }
        // Only set up a timer if we have a valid target date
        if (targetDate !== undefined) {
            let diffTime = 0;
            const timer = setInterval(() => {
                const remaining = getTimeRemaining(serverTime === undefined ? undefined : serverTime + diffTime, targetDate);
                diffTime += 1000;
                // If the remaining time is less than 0, clear the timer
                if (remaining.total <= 0) {
                    if (isCountdown) {
                        setTimeRemainingBeginAt({ total: 0, days: 0, totalHours: 0, minutes: 0, seconds: 0 });
                    } else if (isFundraising) {
                        setTimeRemainingDeadline({ total: 0, days: 0, totalHours: 0, minutes: 0, seconds: 0 });
                    }
                    clearInterval(timer);
                    return;
                }
                // Update the appropriate state based on campaign status
                if (isCountdown) {
                    setTimeRemainingBeginAt(remaining);
                } else if (isFundraising) {
                    setTimeRemainingDeadline(remaining);
                }
            }, 1000);
            // Clean up timer when component unmounts or dependencies change
            return () => clearInterval(timer);
        }
    }, [campaign.campaign.begin_at, campaign.campaign.deadline, campaign_status_code_id]);

    //----------------------------------------------

    // if (pageView === PageViewEnums.manage && isProtocolTeam === false && isAdmin === false && isEditor === false) {
    //     throw new Error('User is not allowed to view this campaign');
    // }
    // TODO : esa validacion se hace en los index de las paginas

    if (pageView !== PageViewEnums.HOME && pageView !== PageViewEnums.INVEST && pageView !== PageViewEnums.CAMPAIGNS && pageView !== PageViewEnums.MANAGE) {
        throw new Error('Invalid campaign view');
    }

    //----------------------------------------------
    // Configs

    const { label, labelClass, buttonsForCards, buttonsForHeader, buttonsForDetails }: CampaignStatusConfigs = useMemo<CampaignStatusConfigs>(
        () =>
            campaignStatusConfigs(
                campaign,
                isProtocolTeam,
                isAdmin,
                isEditor,
                isEditMode,
                isValidEdit ?? true,
                pageView,
                campaign_status_code_id,
                totalMilestones,
                currentMilestoneIndex,
                milestone_status_code_id
            ),
        [campaign, isProtocolTeam, isAdmin, isEditor, isEditMode, pageView, campaign_status_code_id, totalMilestones, currentMilestoneIndex, milestone_status_code_id, isValidEdit]
    );
    //----------------------------------------------
    // Handlers
    const onFinishUpdates = async (campaign: CampaignEX, data?: Record<string, any>) => {
        console.log('onFinishUpdates', campaign, toJson(data));
        const updatePage = async () => {
            const campaignEx = await fetchCampaignById(campaign.campaign._DB_id);
            if (campaignEx === undefined) return;
            if (setCampaignEX) setCampaignEX(campaignEx);
            if (setCampaign) setCampaign(campaignEx.campaign);
            if (fetchCampaignsEX) await fetchCampaignsEX();
            await refreshHaveCampaigns();
        };
        openModal(ModalsEnums.SUCCESS, data);
        await updatePage();
    };
    const onFinishTx = async (campaign: CampaignEX, data?: Record<string, any>) => {
        console.log('onFinishTx', campaign, toJson(data));
        const updatePage = async () => {
            const campaignEx = await fetchCampaignById(campaign.campaign._DB_id);
            if (campaignEx === undefined) return;
            if (setCampaignEX) setCampaignEX(campaignEx);
            if (setCampaign) setCampaign(campaignEx.campaign);
            if (fetchCampaignsEX) await fetchCampaignsEX();
            await refreshHaveCampaigns();
        };
        await updatePage();
    };
    const onFinishTasks = async (campaign: CampaignEX, data?: Record<string, any>) => {
        console.log('onFinishTasks', campaign, toJson(data));
        const updatePage = async () => {
            const campaignEx = await fetchCampaignById(campaign.campaign._DB_id);
            if (campaignEx === undefined) return;
            if (setCampaignEX) setCampaignEX(campaignEx);
            if (setCampaign) setCampaign(campaignEx.campaign);
            if (fetchCampaignsEX) await fetchCampaignsEX();
            await refreshHaveCampaigns();
        };
        await updatePage();
    };
    const onFinishDelete = async (data?: Record<string, any>) => {
        console.log('onFinishDelete', toJson(data));
        const updatePage = async () => {
            // if (setCampaignEX) setCampaignEX(undefined);
            // if (fetchCampaignsEX) await fetchCampaignsEX();
            await router.push(ROUTES.manage, undefined, { shallow: true });
            await refreshHaveCampaigns();
        };
        // openModal(ModalsEnums.SUCCESS, data);
        await updatePage();
    };
    //----------------------------------------------
    const onTx = async () => {};
    //----------------------------------------------
    const onTryAgainTx = async () => {
        // setIsFaildedTx(false);
        // setIsFaildedTx(false);
        // setShowProcessingTx(false);
    };
    //----------------------------------------------
    async function checkIsValidTx() {
        const isValid = true;
        return isValid;
    }
    //--------------------------------------
    const dependenciesValidTx: any[] = [];
    //--------------------------------------
    const {
        tokensStore,
        session,
        status,
        showUserConfirmation,
        setShowUserConfirmation,
        showProcessingTx,
        setShowProcessingTx,
        isProcessingTx,
        setIsProcessingTx,
        isFaildedTx,
        setIsFaildedTx,
        isConfirmedTx,
        setIsConfirmedTx,
        processingTxName,
        setProcessingTxName,
        processingTxMessage,
        setProcessingTxMessage,
        processingTxHash,
        setProcessingTxHash,
        isValidTx,
        setIsValidTx,
        tokensGiveWithMetadata,
        setTokensGiveWithMetadata,
        tokensGetWithMetadata,
        setTokensGetWithMetadata,
        available_ADA_in_Wallet,
        available_forSpend_ADA_in_Wallet,
        isMaxAmountLoaded: isMaxAmountLoadedFromTxHook,
        handleBtnShowUserConfirmation,
        handleBtnDoTransaction_WithErrorControl,
    } = useTransactions({ dependenciesValidTx, checkIsValidTx, onTx });
    //--------------------------------------
    const handleSaveCampaign = (data?: Record<string, any>) => serviceSaveCampaign(appStore, walletStore, openModal, protocol, campaign, data, onFinishTasks);
    const handleDeleteCampaign = (data?: Record<string, any>) => serviceDeleteCampaign(appStore, walletStore, openModal, protocol, campaign, data, onFinishDelete);
    const handleFeatureCampaign = (data?: Record<string, any>) => serviceFeatureCampaign(campaign, data, onFinishUpdates);
    const handleUnFeatureCampaign = (data?: Record<string, any>) => serviceUnFeatureCampaign(campaign, data, onFinishUpdates);
    const handleArchiveCampaign = (data?: Record<string, any>) => serviceArchiveCampaign(campaign, data, onFinishUpdates);
    const handleUnArchiveCampaign = (data?: Record<string, any>) => serviceUnArchiveCampaign(campaign, data, onFinishUpdates);
    const handleSubmitCampaign = (data?: Record<string, any>) => serviceSubmitCampaign(campaign, campaignStatus, submissionStatus, data, onFinishUpdates);
    const handleApproveCampaign = (data?: Record<string, any>) => serviceApproveCampaign(campaign, campaignStatus, submissionStatus, data, onFinishUpdates);
    const handleRejectCampaign = (data?: Record<string, any>) => serviceRejectCampaign(campaign, campaignStatus, submissionStatus, data, onFinishUpdates);
    const handleCreateSmartContracts = (data?: Record<string, any>) =>
        serviceCreateSmartContracts(appStore, walletStore, openModal, protocol, campaign, campaignStatus, data, onFinishTasks);
    const handlePublishSmartContracts = (data?: Record<string, any>) =>
        servicePublishSmartContracts(appStore, walletStore, openModal, protocol, campaign, campaignStatus, data, onFinishTx);

    const handleInitializeCampaign = (data?: Record<string, any>) =>
        serviceInitializeCampaign(appStore, walletStore, openModal, protocol, handleBtnDoTransaction_WithErrorControl, campaign, campaignStatus, data, onFinishTx);

    const handlePrepareUTxOs = (data?: Record<string, any>) =>
        servicePrepareUTxOs(appStore, walletStore, openModal, protocol, handleBtnDoTransaction_WithErrorControl, campaign, campaignStatus, data, onFinishTx);

    const handleLaunchCampaign = (data?: Record<string, any>) =>
        serviceLaunchCampaign(appStore, walletStore, openModal, protocol, handleBtnDoTransaction_WithErrorControl, campaign, campaignStatus, data, onFinishTx);

    const handleInvest = (data?: Record<string, any>) =>
        serviceInvest(appStore, walletStore, openModal, protocol, handleBtnDoTransaction_WithErrorControl, campaign, campaignStatus, data, onFinishTx);

    const handleValidateFundraisingStatus = (data?: Record<string, any>) =>
        serviceValidateFundraisingStatus(appStore, walletStore, openModal, protocol, handleBtnDoTransaction_WithErrorControl, campaign, campaignStatus, data, onFinishTx);

    const handleSubmitMilestone = (data?: Record<string, any>) =>
        serviceSubmitMilestone(campaign, currentMilestoneIndex ?? 1, milestoneStatus, submissionStatus, data, onFinishUpdates);
    const handleApproveMilestone = (data?: Record<string, any>) =>
        serviceApproveMilestone(
            appStore,
            walletStore,
            openModal,
            protocol,
            handleBtnDoTransaction_WithErrorControl,
            campaign,
            currentMilestoneIndex ?? 1,
            milestoneStatus,
            submissionStatus,
            data,
            onFinishTx
        );
    const handleRejectMilestone = (data?: Record<string, any>) =>
        serviceRejectMilestone(campaign, currentMilestoneIndex ?? 1, milestoneStatus, submissionStatus, data, onFinishUpdates);
    const handleFailMilestone = (data?: Record<string, any>) =>
        serviceFailMilestone(
            appStore,
            walletStore,
            openModal,
            protocol,
            handleBtnDoTransaction_WithErrorControl,
            campaign,
            currentMilestoneIndex ?? 1,
            milestoneStatus,
            submissionStatus,
            data,
            onFinishTx
        );

    const handleCollect = (data?: Record<string, any>) =>
        serviceCollect(
            appStore,
            walletStore,
            openModal,
            protocol,
            handleBtnDoTransaction_WithErrorControl,
            campaign,
            currentMilestoneIndex ?? 1,
            milestoneStatus,
            data,
            onFinishTx
        );

    const handleGetBack = (data?: Record<string, any>) =>
        serviceGetBack(appStore, walletStore, openModal, protocol, handleBtnDoTransaction_WithErrorControl, campaign, campaignStatus, data, onFinishTx);

    //----------------------------------------------
    const handles = {
        [HandlesEnums.SAVE_CAMPAIGN]: handleSaveCampaign,
        [HandlesEnums.DELETE_CAMPAIGN]: handleDeleteCampaign,
        [HandlesEnums.FEATURE_CAMPAIGN]: handleFeatureCampaign,
        [HandlesEnums.UN_FEATURE_CAMPAIGN]: handleUnFeatureCampaign,
        [HandlesEnums.ARCHIVE_CAMPAIGN]: handleArchiveCampaign,
        [HandlesEnums.UN_ARCHIVE_CAMPAIGN]: handleUnArchiveCampaign,

        [HandlesEnums.SUBMIT_CAMPAIGN]: handleSubmitCampaign,
        [HandlesEnums.APPROVE_CAMPAIGN]: handleApproveCampaign,
        [HandlesEnums.REJECT_CAMPAIGN]: handleRejectCampaign,

        [HandlesEnums.CREATE_SMART_CONTRACTS]: handleCreateSmartContracts,
        [HandlesEnums.PUBLISH_SMART_CONTRACTS]: handlePublishSmartContracts,
        [HandlesEnums.INITIALIZE_CAMPAIGN]: handleInitializeCampaign,

        [HandlesEnums.MANAGE_CAMPAIGN_UTXOS]: handlePrepareUTxOs,

        [HandlesEnums.LAUNCH_CAMPAIGN]: handleLaunchCampaign,

        [HandlesEnums.INVEST]: handleInvest,

        [HandlesEnums.SET_FUNDRAISING_STATUS]: handleValidateFundraisingStatus,

        [HandlesEnums.SUBMIT_MILESTONE]: handleSubmitMilestone,
        [HandlesEnums.APPROVE_MILESTONE]: handleApproveMilestone,
        [HandlesEnums.REJECT_MILESTONE]: handleRejectMilestone,
        [HandlesEnums.FAIL_MILESTONE]: handleFailMilestone,

        [HandlesEnums.COLLECT_FUNDS]: handleCollect,

        [HandlesEnums.GETBACK_FUNDS]: handleGetBack,
    };
    //----------------------------------------------
    return {
        isAdmin,
        isEditor,
        isProtocolTeam,
        pageView,
        campaign_category_name,
        campaign_status_code_id,
        label,
        labelClass,
        buttonsForCards,
        buttonsForHeader,
        buttonsForDetails,
        handles,
        timeRemainingBeginAt,
        timeRemainingDeadline,
        currentMilestone_status_code_id: milestone_status_code_id,
        currentMilestoneIndex,
        currentMilestoneString: `${(currentMilestoneIndex ?? 0) + 1}`,
        currentMilestoneStringOrdinal: getOrdinalString((currentMilestoneIndex ?? 0) + 1),
        totalMilestones,
        fundedPercentage,
        requestedMinPercentage,
        progressWidth,
    };
};
