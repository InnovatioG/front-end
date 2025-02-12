import {
    CampaignContentEntity,
    CampaignEntity,
    CampaignFaqsEntity,
    CampaignMemberEntity,
    CampaignSubmissionEntity,
    MilestoneEntity,
    MilestoneSubmissionEntity,
} from '@/lib/SmartDB/Entities';
import { CampaignContentApi, CampaignFaqsApi, CampaignMemberApi, MilestoneApi, MilestoneSubmissionApi } from '@/lib/SmartDB/FrontEnd';
import { useGeneralStore } from '@/store/generalStore/useGeneralStore';
import { CampaignEX, MilestoneEX } from '@/types/types';
import { CampaignViewForEnums } from '@/utils/constants/constants';
import { MilestoneStatus_Code_Id_Enums } from '@/utils/constants/status';
import { CampaignStatusConfig, campaignConfig } from '@/utils/constants/stylesAndButtonsByStatusCodeId';
import { calculatePercentageValue, formatMoney, formatTime, getOrdinalString, getTimeRemaining } from '@/utils/formats';
import { bool } from 'aws-sdk/clients/signer';
import { useEffect, useMemo, useState } from 'react';
import { useWalletStore } from 'smart-db';

export const getCampaignEX = async (campaign: CampaignEntity): Promise<CampaignEX> => {
    const milestonesEntities: MilestoneEntity[] = await MilestoneApi.getByParamsApi_({ campaign_id: campaign._DB_id }, { sort: { order: 1 } });
    const campaignFaqsEntities: CampaignFaqsEntity[] = await CampaignFaqsApi.getByParamsApi_({ campaign_id: campaign._DB_id }, { sort: { order: 1 } });
    const campaignMemberEntities: CampaignMemberEntity[] = await CampaignMemberApi.getByParamsApi_({ campaign_id: campaign._DB_id }, { sort: { order: 1 } });
    const campaignnContentEntities: CampaignContentEntity[] = await CampaignContentApi.getByParamsApi_({ campaign_id: campaign._DB_id }, { sort: { order: 1 } });

    const milestonesEX = await Promise.all(milestonesEntities.map(getMilestonesEX));

    return {
        campaign: campaign,
        milestones: milestonesEX,
        contents: campaignnContentEntities,
        members: campaignMemberEntities,
        faqs: campaignFaqsEntities,
    };
};

export const getMilestonesEX = async (milestone: MilestoneEntity): Promise<MilestoneEX> => {
    const milestone_submissions: MilestoneSubmissionEntity[] = await MilestoneSubmissionApi.getByParamsApi_({ milestone_id: milestone._DB_id }, { sort: { updatedAt: -1 } });

    return {
        milestone: milestone,
        milestone_submissions: milestone_submissions,
    };
};

export const saveEntityList = async <T extends { _DB_id?: string }>(
    list: T[] | undefined,
    deletedList: T[] | undefined,
    updateApi: (id: string, entity: T) => Promise<T>,
    createApi: (entity: T) => Promise<T>,
    deleteApi: (id: string) => Promise<boolean>
): Promise<T[]> => {
    const savedEntities: T[] = [];

    console.log(`saveEntityList`);

    // 🔹 Update existing & create new items
    if (list) {
        for (const item of list) {
            if (item._DB_id) {
                const updatedEntity = await updateApi(item._DB_id, item);
                savedEntities.push(updatedEntity);
            } else {
                const createdEntity = await createApi(item);
                savedEntities.push(createdEntity);
            }
        }
    }

    // 🔹 Delete removed items
    if (deletedList) {
        for (const item of deletedList) {
            if (item._DB_id) {
                await deleteApi(item._DB_id);
            }
        }
    }

    return savedEntities;
};

// Deep copies a `CampaignEX` object, ensuring all nested entities are properly instantiated.
export const cloneCampaignEX = (campaign: CampaignEX | undefined): CampaignEX | undefined => {
    if (!campaign) return undefined;

    return {
        campaign: new CampaignEntity({ ...campaign.campaign }), // Ensure new instance
        campaign_submissions: campaign.campaign_submissions
            ? campaign.campaign_submissions.map((s) => new CampaignSubmissionEntity({ ...s })) // Ensure deep copy
            : undefined,
        campaign_submissions_deleted: campaign.campaign_submissions_deleted
            ? campaign.campaign_submissions_deleted.map((s) => new CampaignSubmissionEntity({ ...s })) // Ensure deep copy
            : undefined,
        milestones: campaign.milestones
            ? campaign.milestones.map((m) => cloneMilestoneEX(m)) // Clone each milestone
            : undefined,
        milestones_deleted: campaign.milestones_deleted
            ? campaign.milestones_deleted.map((m) => cloneMilestoneEX(m)) // Clone each milestone
            : undefined,
        contents: campaign.contents
            ? campaign.contents.map((c) => new CampaignContentEntity({ ...c })) // Ensure deep copy
            : undefined,
        contents_deleted: campaign.contents_deleted
            ? campaign.contents_deleted.map((c) => new CampaignContentEntity({ ...c })) // Ensure deep copy
            : undefined,
        members: campaign.members
            ? campaign.members.map((m) => new CampaignMemberEntity({ ...m })) // Ensure deep copy
            : undefined,
        members_deleted: campaign.members_deleted
            ? campaign.members_deleted.map((m) => new CampaignMemberEntity({ ...m })) // Ensure deep copy
            : undefined,
        faqs: campaign.faqs
            ? campaign.faqs.map((f) => new CampaignFaqsEntity({ ...f })) // Ensure deep copy
            : undefined,
        faqs_deleted: campaign.faqs_deleted
            ? campaign.faqs_deleted.map((f) => new CampaignFaqsEntity({ ...f })) // Ensure deep copy
            : undefined,
    };
};

// Deep copies a `MilestoneEX` object.
export const cloneMilestoneEX = (milestone: MilestoneEX): MilestoneEX => {
    return {
        milestone: new MilestoneEntity({ ...milestone.milestone }), // Ensure new instance
        milestone_submissions: milestone.milestone_submissions
            ? milestone.milestone_submissions.map((s) => new MilestoneSubmissionEntity({ ...s })) // Ensure deep copy
            : undefined,
        milestone_submissions_deleted: milestone.milestone_submissions_deleted
            ? milestone.milestone_submissions_deleted.map((s) => new MilestoneSubmissionEntity({ ...s })) // Ensure deep copy
            : undefined,
    };
};

export const getRemainingPercentage = (currentmilestone_id: number, milestones: MilestoneEX[]): number => {
    const totalUsed = milestones
        .filter((milestone) => Number(milestone.milestone._DB_id) !== currentmilestone_id)
        .reduce((sum, milestone) => sum + milestone.milestone.percentage, 0);
    return 100 - totalUsed;
};

export const getCampaignCategory_Name_By_Db_Id = (id: string) => {
    const category = useGeneralStore.getState().campaignCategories.find((category) => category._DB_id === id);
    if (!category) {
        throw new Error(`Campaign category with id ${id} not found`);
    }
    return category.name;
};

export const getCampaignStatus_Code_Id_By_Db_Id = (id: string) => {
    const status = useGeneralStore.getState().campaignStatus.find((status) => status._DB_id === id);
    if (!status) {
        throw new Error(`Campaign status with id ${id} not found`);
    }
    return status.code_id;
};

export const getMilestoneStatus_Code_Id_By_Db_Id = (id: string) => {
    const milestone = useGeneralStore.getState().milestoneStatus.find((milestone) => milestone._DB_id === id);
    if (!milestone) {
        throw new Error(`Milestone status with id ${id} not found`);
    }
    return milestone.code_id;
};

export interface ICampaignDetails extends CampaignStatusConfig {
    isAdmin: boolean;
    isEditor: boolean;
    isProtocolTeam: boolean;
    campaignViewFor: CampaignViewForEnums;
    campaign_category_name: string;
    campaign_status_code_id: number;
    timeRemainingBeginAt: { total: number; days: number; totalHours: number; minutes: number };
    timeRemainingDeadline: { total: number; days: number; totalHours: number; minutes: number };
    formatAllTime: (timeRemaining: any) => string;
    currentMilestone_status_code_id: number | undefined;
    currentMilestoneIndex: number | undefined;
    currentMilestoneString: string;
    currentMilestoneStringOrdinal: string;
    totalMilestones: number;
    formatMoneyByADAOrDollar: (value: number | bigint) => string;
    fundedPercentage: string;
    requestedMinPercentage: string;
    progressWidth: string;
    requestedMaxInCurrentCurrency: number;
    requestedMinADAInCurrentCurrency: number;
    currencySymbol: string;
}

export const useCampaignDetails = ({
    campaign,
    campaignViewFor,
    isEditMode,
}: {
    campaign: CampaignEX;
    campaignViewFor: CampaignViewForEnums;
    isEditMode: boolean;
}): ICampaignDetails => {
    const walletStore = useWalletStore();
    const { wallet, adaPrice, priceADAOrDollar, isProtocolTeam, _DebugIsAdmin, _DebugIsEditor } = useGeneralStore();
    const { requestedMaxADA, requestedMinADA, cdFundedADA } = campaign.campaign;
    const [isAdmin, setIsAdmin] = useState(false);
    const [isEditor, setIsEditor] = useState(false);

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

    // const { openModal } = useModal(); // pathName === ROUTES.manage &&

    const getCurrentMilestoneIndex = (campaign: CampaignEX): number | undefined => {
        // console.log('getCurrentMilestoneIndex', toJson(campaign));

        if (!campaign.milestones || campaign.milestones.length === 0) {
            return undefined;
        }

        let firstNotStartedIndex = -1;
        let lastFinishedIndex = -1;
        let hasActiveMilestone = false;

        for (let i = 0; i < campaign.milestones.length; i++) {
            const milestone = campaign.milestones[i];
            const code_id = getMilestoneStatus_Code_Id_By_Db_Id(milestone.milestone.milestone_status_id);

            if (code_id === MilestoneStatus_Code_Id_Enums.NOT_STARTED) {
                if (firstNotStartedIndex === -1) {
                    firstNotStartedIndex = i;
                }
            } else if (code_id === MilestoneStatus_Code_Id_Enums.FINISHED) {
                lastFinishedIndex = i;
            } else {
                // If milestone is STARTED, SUBMITTED, REJECTED, or FAILED, return it as the current active
                hasActiveMilestone = true;
                return i;
            }
        }

        // Case 1: If all milestones are FINISHED, return the last finished milestone
        if (!hasActiveMilestone && firstNotStartedIndex === -1 && lastFinishedIndex !== -1) {
            return lastFinishedIndex;
        }

        // Case 2: If all milestones are NOT_STARTED, return the first one
        if (!hasActiveMilestone && firstNotStartedIndex !== -1 && lastFinishedIndex === -1) {
            return firstNotStartedIndex;
        }

        // Case 3: If a milestone is FINISHED, find the first NOT_STARTED milestone after it
        if (lastFinishedIndex !== -1) {
            for (let i = lastFinishedIndex + 1; i < campaign.milestones.length; i++) {
                const code_id = getMilestoneStatus_Code_Id_By_Db_Id(campaign.milestones[i].milestone.milestone_status_id);
                if (code_id === MilestoneStatus_Code_Id_Enums.NOT_STARTED) {
                    return i;
                }
            }
        }

        // Case 4: If no active milestone is found, return the first NOT_STARTED one as fallback
        if (firstNotStartedIndex !== -1) {
            return firstNotStartedIndex;
        }

        throw new Error('No current milestone found');
    };

    const campaign_category_name = getCampaignCategory_Name_By_Db_Id(campaign.campaign.campaign_category_id);
    const campaign_status_code_id = getCampaignStatus_Code_Id_By_Db_Id(campaign.campaign.campaign_status_id);

    const totalMilestones = campaign.milestones ? campaign.milestones.length : 0;

    const currentMilestoneIndex = getCurrentMilestoneIndex(campaign);

    const milestone_status_code_id =
        currentMilestoneIndex === undefined ? undefined : getMilestoneStatus_Code_Id_By_Db_Id(campaign.milestones![currentMilestoneIndex].milestone.milestone_status_id);

    const [timeRemainingBeginAt, setTimeRemainingBeginAt] = useState(getTimeRemaining(campaign.campaign.begin_at));

    const [timeRemainingDeadline, setTimeRemainingDeadline] = useState(
        campaign.campaign.deadline ? getTimeRemaining(campaign.campaign.deadline) : { total: 0, days: 0, totalHours: 0, minutes: 0 }
    );

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

    const formatAllTime = (timeRemaining: any) => {
        if (timeRemaining.days >= 4) {
            return `${timeRemaining.days} days`;
        } else {
            return `${formatTime(timeRemaining.totalHours)}:${formatTime(timeRemaining.minutes)}: ${formatTime(timeRemaining.seconds)}`;
        }
    };

    const formatMoneyByADAOrDollar = (value: number | bigint) => {
        if (typeof value !== 'number' && value !== undefined) {
            value = Number(value);
        }
        if (priceADAOrDollar === 'dollar') {
            return formatMoney(Number(value) / Number(adaPrice), 'USD');
        }
        return formatMoney(Number(value), 'ADA');
    };

    const fundedPercentage = useMemo(() => calculatePercentageValue(requestedMaxADA, Number(cdFundedADA)), [requestedMaxADA, cdFundedADA]);
    const requestedMinPercentage = useMemo(() => calculatePercentageValue(requestedMaxADA, requestedMinADA), [requestedMinADA, requestedMaxADA]);

    const progressWidth = `${fundedPercentage}%`;

    const [requestedMaxInCurrentCurrency, setRequestedMaxInCurrentCurrency] = useState(0);
    const [requestedMinADAInCurrentCurrency, setRequestedMinADAInCurrentCurrency] = useState(0);
    const [currencySymbol, setCurrencySymbol] = useState('ADA');

    useEffect(() => {
        if (!adaPrice || adaPrice === 0) return;
        setRequestedMaxInCurrentCurrency(priceADAOrDollar === 'dollar' ? Number(requestedMaxADA) : Number(requestedMaxADA) / adaPrice);
    }, [priceADAOrDollar, requestedMaxADA, adaPrice]);

    useEffect(() => {
        if (!adaPrice || adaPrice === 0) return;
        setRequestedMinADAInCurrentCurrency(priceADAOrDollar === 'dollar' ? Number(requestedMinADA) : Number(requestedMinADA) / adaPrice);
    }, [priceADAOrDollar, requestedMinADA, adaPrice]);

    useEffect(() => {
        setCurrencySymbol(priceADAOrDollar === 'dollar' ? 'USD' : 'ADA');
    }, [priceADAOrDollar]);

    // if (campaignViewFor === CampaignViewForEnums.manage && isProtocolTeam === false && isAdmin === false && isEditor === false) {
    //     throw new Error('User is not allowed to view this campaign');
    // }
    // TODO : esa validacion se hace en los index de las paginas

    if (campaignViewFor !== CampaignViewForEnums.home && campaignViewFor !== CampaignViewForEnums.campaigns && campaignViewFor !== CampaignViewForEnums.manage) {
        throw new Error('Invalid campaign view');
    }

    const { label, labelClass, buttonsForCards, buttonsForHeader, buttonsForDetails }: CampaignStatusConfig = campaignConfig(
        campaign,
        isProtocolTeam,
        isAdmin,
        isEditor,
        isEditMode,
        campaignViewFor,
        campaign_status_code_id,
        totalMilestones,
        currentMilestoneIndex,
        milestone_status_code_id
    );
    return {
        isAdmin,
        isEditor,
        isProtocolTeam,
        campaignViewFor,
        campaign_category_name,
        campaign_status_code_id,
        label,
        labelClass,
        buttonsForCards,
        buttonsForHeader,
        buttonsForDetails,
        timeRemainingBeginAt,
        timeRemainingDeadline,
        formatAllTime,
        currentMilestone_status_code_id: milestone_status_code_id,
        currentMilestoneIndex,
        currentMilestoneString: `${(currentMilestoneIndex ?? 0) + 1}`,
        currentMilestoneStringOrdinal: getOrdinalString((currentMilestoneIndex ?? 0) + 1),
        totalMilestones,
        formatMoneyByADAOrDollar,
        fundedPercentage,
        requestedMinPercentage,
        progressWidth,
        requestedMaxInCurrentCurrency,
        requestedMinADAInCurrentCurrency,
        currencySymbol,
    };
};
