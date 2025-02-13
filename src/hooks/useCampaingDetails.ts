import { CampaignEntity } from '@/lib/SmartDB/Entities';
import { useGeneralStore } from '@/store/generalStore/useGeneralStore';
import { CampaignEX } from '@/types/types';
import { CampaignStatusConfigs, campaignStatusConfigs } from '@/utils/campaignConfigs';
import {
    serviceApproveCampaign,
    serviceArchiveCampaign,
    serviceCreateSmartContracts,
    serviceFailMilestoneAndCampaign,
    serviceFeatureCampaign,
    serviceInitializeCampaign,
    serviceLaunchCampaign,
    servicePublishSmartContracts,
    serviceRejectCampaign,
    serviceSaveCampaign,
    serviceSetFinishingCampaign,
    serviceSetFundraisingCampaign,
    serviceSubmitCampaign,
    serviceUnArchiveCampaign,
    serviceUnFeatureCampaign,
    serviceValidateFundraisingStatusSetReached,
    serviceValidateFundraisingStatusSetUnReached,
} from '@/utils/campaignServices';
import { HandlesEnums, ModalsEnums } from '@/utils/constants/constants';
import { PageViewEnums } from '@/utils/constants/routes';
import { calculatePercentageValue, getOrdinalString, getTimeRemaining } from '@/utils/formats';
import { useEffect, useMemo, useState } from 'react';
import { toJson, useWalletStore } from 'smart-db';
import { getCampaignCategory_Name_By_Db_Id, getCampaignStatus_Code_Id_By_Db_Id, getCurrentMilestoneIndex, getMilestoneStatus_Code_Id_By_Db_Id } from '../utils/campaignHelpers';
import { useModal } from '@/contexts/ModalContext';

export interface ICampaignDetails extends CampaignStatusConfigs {
    handles: Partial<Record<HandlesEnums, (data?: Record<string, any>) => Promise<void>>>;
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
}

export const useCampaignDetails = ({ campaign, pageView, isEditMode, setCampaignEX, setCampaign, fetchCampaignsEX }: useCampaignDetailsProps): ICampaignDetails => {
    //----------------------------------------------

    const walletStore = useWalletStore();
    const { wallet, isProtocolTeam, _DebugIsAdmin, _DebugIsEditor, campaignStatus } = useGeneralStore();
    const { openModal } = useModal();

    //----------------------------------------------
    // States

    const { requestedMaxADA, requestedMinADA, cdFundedADA } = useMemo(() => campaign.campaign, [campaign]);

    const [isAdmin, setIsAdmin] = useState(false);
    const [isEditor, setIsEditor] = useState(false);

    const campaign_category_name = useMemo(() => getCampaignCategory_Name_By_Db_Id(campaign.campaign.campaign_category_id), [campaign]);
    const campaign_status_code_id = useMemo(() => getCampaignStatus_Code_Id_By_Db_Id(campaign.campaign.campaign_status_id), [campaign]);

    const totalMilestones = useMemo(() => (campaign.milestones ? campaign.milestones.length : 0), [campaign]);
    const currentMilestoneIndex = useMemo(() => getCurrentMilestoneIndex(campaign), [campaign]);

    const milestone_status_code_id =
        currentMilestoneIndex === undefined ? undefined : getMilestoneStatus_Code_Id_By_Db_Id(campaign.milestones![currentMilestoneIndex].milestone.milestone_status_id);

    const [timeRemainingBeginAt, setTimeRemainingBeginAt] = useState(getTimeRemaining(campaign.campaign.begin_at));
    const [timeRemainingDeadline, setTimeRemainingDeadline] = useState(
        campaign.campaign.deadline ? getTimeRemaining(campaign.campaign.deadline) : { total: 0, days: 0, totalHours: 0, minutes: 0 }
    );

    const fundedPercentage = useMemo(() => calculatePercentageValue(requestedMaxADA, Number(cdFundedADA)), [requestedMaxADA, cdFundedADA]);
    const requestedMinPercentage = useMemo(() => calculatePercentageValue(requestedMaxADA, requestedMinADA), [requestedMinADA, requestedMaxADA]);
    const progressWidth = useMemo(() => `${fundedPercentage}%`, [fundedPercentage]);

    //----------------------------------------------
    // Effects

    useEffect(() => {
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
        const timer = setInterval(() => {
            setTimeRemainingBeginAt(getTimeRemaining(campaign.campaign.begin_at));
        }, 1000);

        return () => clearInterval(timer);
    }, [campaign.campaign.begin_at]);

    useEffect(() => {
        const timer = setInterval(() => {
            if (campaign.campaign.deadline) {
                setTimeRemainingDeadline(getTimeRemaining(campaign.campaign.deadline));
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [campaign.campaign.deadline]);

    //----------------------------------------------

    // const [requestedMaxInCurrentCurrency, setRequestedMaxInCurrentCurrency] = useState(0);
    // const [requestedMinADAInCurrentCurrency, setRequestedMinADAInCurrentCurrency] = useState(0);
    // const [currencySymbol, setCurrencySymbol] = useState('ADA');

    // useEffect(() => {
    //     if (!adaPrice || adaPrice === 0) return;
    //     setRequestedMaxInCurrentCurrency(priceADAOrDollar === 'dollar' ? Number(requestedMaxADA) : Number(requestedMaxADA) / adaPrice);
    // }, [priceADAOrDollar, requestedMaxADA, adaPrice]);

    // useEffect(() => {
    //     if (!adaPrice || adaPrice === 0) return;
    //     setRequestedMinADAInCurrentCurrency(priceADAOrDollar === 'dollar' ? Number(requestedMinADA) : Number(requestedMinADA) / adaPrice);
    // }, [priceADAOrDollar, requestedMinADA, adaPrice]);

    // useEffect(() => {
    //     setCurrencySymbol(priceADAOrDollar === 'dollar' ? 'USD' : 'ADA');
    // }, [priceADAOrDollar]);

    //----------------------------------------------

    // if (pageView === PageViewEnums.manage && isProtocolTeam === false && isAdmin === false && isEditor === false) {
    //     throw new Error('User is not allowed to view this campaign');
    // }
    // TODO : esa validacion se hace en los index de las paginas

    if (pageView !== PageViewEnums.HOME && pageView !== PageViewEnums.CAMPAIGNS && pageView !== PageViewEnums.MANAGE) {
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
                pageView,
                campaign_status_code_id,
                totalMilestones,
                currentMilestoneIndex,
                milestone_status_code_id
            ),
        [campaign, isProtocolTeam, isAdmin, isEditor, isEditMode, pageView, campaign_status_code_id, totalMilestones, currentMilestoneIndex, milestone_status_code_id]
    );

    //----------------------------------------------
    // Handlers

    const onFinish = async (campaign: CampaignEX, data?: Record<string, any>) => {
        console.log('onFinish', campaign, toJson(data));
        const updatePage = async () => {
            if (setCampaignEX) setCampaignEX(campaign);
            if (setCampaign) setCampaign(campaign.campaign);
            if (fetchCampaignsEX) await fetchCampaignsEX();
        };
        openModal(ModalsEnums.SUCCESS, data);
        await updatePage();
    };

    const handleSaveCampaign = (data?: Record<string, any>) => serviceSaveCampaign(campaign, data, onFinish);
    const handleFeatureCampaign = (data?: Record<string, any>) => serviceFeatureCampaign(campaign, data, onFinish);
    const handleUnFeatureCampaign = (data?: Record<string, any>) => serviceUnFeatureCampaign(campaign, data, onFinish);
    const handleArchiveCampaign = (data?: Record<string, any>) => serviceArchiveCampaign(campaign, data, onFinish);
    const handleUnArchiveCampaign = (data?: Record<string, any>) => serviceUnArchiveCampaign(campaign, data, onFinish);
    const handleSubmitCampaign = (data?: Record<string, any>) => serviceSubmitCampaign(campaign, campaignStatus, data, onFinish);
    const handleApproveCampaign = (data?: Record<string, any>) => serviceApproveCampaign(campaign, campaignStatus, data, onFinish);
    const handleRejectCampaign = (data?: Record<string, any>) => serviceRejectCampaign(campaign, campaignStatus, data, onFinish);
    const handleCreateSmartContracts = (data?: Record<string, any>) => serviceCreateSmartContracts(campaign, campaignStatus, data, onFinish);
    const handlePublishSmartContracts = (data?: Record<string, any>) => servicePublishSmartContracts(campaign, campaignStatus, data, onFinish);
    const handleInitializeCampaign = (data?: Record<string, any>) => serviceInitializeCampaign(campaign, campaignStatus, data, onFinish);
    const handleLaunchCampaign = (data?: Record<string, any>) => serviceLaunchCampaign(campaign, campaignStatus, data, onFinish);
    const handleSetFundraisingCampaign = (data?: Record<string, any>) => serviceSetFundraisingCampaign(campaign, campaignStatus, data, onFinish);
    const handleSetFinishingCampaign = (data?: Record<string, any>) => serviceSetFinishingCampaign(campaign, campaignStatus, data, onFinish);
    const handleValidateFundraisingStatusSetReached = (data?: Record<string, any>) => serviceValidateFundraisingStatusSetReached(campaign, campaignStatus, data, onFinish);
    const handleValidateFundraisingStatusSetUnReached = (data?: Record<string, any>) => serviceValidateFundraisingStatusSetUnReached(campaign, campaignStatus, data, onFinish);
    const handleFailMilestoneAndCampaign = (data?: Record<string, any>) => serviceFailMilestoneAndCampaign(campaign, campaignStatus, data, onFinish);

    const handles = {
        [HandlesEnums.SAVE_CAMPAIGN]: handleSaveCampaign,
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
        [HandlesEnums.LAUNCH_CAMPAIGN]: handleLaunchCampaign,

        [HandlesEnums.SET_FUNDRAISING_STATUS]: handleSetFundraisingCampaign,
        [HandlesEnums.SET_FINISHING_STATUS]: handleSetFinishingCampaign,
        [HandlesEnums.SET_REACHED_STATUS]: handleValidateFundraisingStatusSetReached,
        [HandlesEnums.SET_UNREACHED_STATUS]: handleValidateFundraisingStatusSetUnReached,
        [HandlesEnums.SET_FAILED_STATUS]: handleFailMilestoneAndCampaign,
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
