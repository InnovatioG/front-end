import { CampaignContentEntity, CampaignEntity, CampaignFaqsEntity, CampaignMemberEntity, MilestoneEntity, MilestoneSubmissionEntity } from '@/lib/SmartDB/Entities';
import { CampaignContentApi, CampaignFaqsApi, CampaignMemberApi, MilestoneApi, MilestoneSubmissionApi } from '@/lib/SmartDB/FrontEnd';
import { useGeneralStore } from '@/store/generalStore/useGeneralStore';
import { CampaignEX, MilestoneEX } from '@/types/types';
import { MilestoneStatus_Code_Id } from '@/utils/constants/status';
import { CampaignStatusConfig, CardInformationForInvestors, CardInformationForManagers, cardInformationForProtocolTeam } from '@/utils/constants/stylesAndButtonsByStatusCodeId';
import { calculatePercentageValue, formatMoney, formatTime, getOrdinalString, getTimeRemaining } from '@/utils/formats';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useWalletStore } from 'smart-db';

interface getRemainingPercentageProps {
    (currentmilestone_id: number, milestones: MilestoneEX[]): number;
}

export const getRemainingPercentage: getRemainingPercentageProps = (currentmilestone_id, milestones) => {
    const totalUsed = milestones
        .filter((milestone) => Number(milestone.milestone._DB_id) !== currentmilestone_id)
        .reduce((sum, milestone) => sum + milestone.milestone.percentage, 0);
    return 100 - totalUsed;
};

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

export const useCampaignDetails = (campaign: CampaignEX): ICampaignDetails => {
    const router = useRouter();
    const pathName = router.pathname;

    const walletStore = useWalletStore();
    const { wallet, adaPrice, priceADAOrDollar } = useGeneralStore();

    const { requestedMaxADA, requestedMinADA, cdFundedADA } = campaign.campaign;

    // const { openModal } = useModal(); // pathName === ROUTES.manage &&

    const isProtocolTeam = walletStore.isConnected === true && walletStore.info!.isWalletValidatedWithSignedToken === true && walletStore.isCoreTeam();

    // const isProtocolTeam = true; pathName === ROUTES.manage &&

    const isAdmin =
        walletStore.isConnected === true &&
        walletStore.info!.isWalletValidatedWithSignedToken === true &&
        wallet !== undefined &&
        campaign.campaign.creator_wallet_id === wallet._DB_id;

    // const isAdmin = true;

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

            if (code_id === MilestoneStatus_Code_Id.NOT_STARTED) {
                if (firstNotStartedIndex === -1) {
                    firstNotStartedIndex = i;
                }
            } else if (code_id === MilestoneStatus_Code_Id.FINISHED) {
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
                if (code_id === MilestoneStatus_Code_Id.NOT_STARTED) {
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

    const { label, labelClass, buttonsForCards, buttonsForHeader, buttonsForDetails }: CampaignStatusConfig = isProtocolTeam
        ? cardInformationForProtocolTeam(campaign_status_code_id, totalMilestones, currentMilestoneIndex, milestone_status_code_id)
        : isAdmin
        ? CardInformationForManagers(campaign_status_code_id, totalMilestones, currentMilestoneIndex, milestone_status_code_id)
        : CardInformationForInvestors(campaign_status_code_id, totalMilestones, currentMilestoneIndex, milestone_status_code_id);

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

    return {
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
