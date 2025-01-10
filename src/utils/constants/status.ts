/* import type { MilestoneStatusGlobal } from '@/HardCode/databaseType';
 */
//--------------------------------------------------------------

export enum CampaignDatumStatus {
    CsCreated = 1,
    CsInitialized = 2,
    CsReached = 3,
    CsNotReached = 4,
    CsFailedMilestone = 5,
}

export enum MilestoneDatumStatus {
    MsCreated = 1,
    MsSuccess = 2,
    MsFailed = 3,
}

export enum CampaignStatus {
    NOT_STARTED = 0,
    CREATED = 1,
    SUBMITTED = 2,
    REJECTED = 3,
    APPROVED = 4,
    CONTRACT_CREATED = 5,
    CONTRACT_PUBLISHED = 6,
    CONTRACT_STARTED = 7,
    COUNTDOWN = 8,
    FUNDRAISING = 9,
    FINISHING = 10,
    ACTIVE = 11,
    FAILED = 12,
    UNREACHED = 13,
    SUCCESS = 14,
}

export enum MilestoneStatus {
    NOT_STARTED = 1,
    STARTED = 2,
    SUBMITTED = 3,
    REJECTED = 4,
    FINISHED = 5,
    FAILED = 6,
}

export enum SubmissionStatus {
    SUBMITTED = 1,
    APPROVED = 2,
    REJECTED = 3,
    FAILED = 4,
}

//--------------------------------------------------------------

export const stylesByStatus = (status: number, styles: { [key: string]: string }): string => {
    const statusStyles: Partial<Record<CampaignStatus, string>> = {
        [CampaignStatus.NOT_STARTED]: styles.notStarted,
        [CampaignStatus.CREATED]: styles.created,
        [CampaignStatus.SUBMITTED]: styles.submitted,
        [CampaignStatus.REJECTED]: styles.rejected,
        [CampaignStatus.APPROVED]: styles.approved,
        [CampaignStatus.CONTRACT_CREATED]: styles.contractCreated,
        [CampaignStatus.CONTRACT_PUBLISHED]: styles.contractPublished,
        [CampaignStatus.CONTRACT_STARTED]: styles.contractStarted,
        [CampaignStatus.COUNTDOWN]: styles.countdown,
        [CampaignStatus.FUNDRAISING]: styles.fundraising,
        [CampaignStatus.FINISHING]: styles.finishing,
        [CampaignStatus.ACTIVE]: styles.active,
        [CampaignStatus.FAILED]: styles.failed,
        [CampaignStatus.UNREACHED]: styles.unreached,
        [CampaignStatus.SUCCESS]: styles.success,
    };

    return statusStyles[status as CampaignStatus] || styles.pending;
};

export const imageByStatus = (status: number): string => {
    const statusImages: Partial<Record<CampaignStatus, string>> = {
        [CampaignStatus.NOT_STARTED]: '/img/icons/status/yellow.svg',
        [CampaignStatus.CREATED]: '/img/icons/status/blue.svg',
        [CampaignStatus.SUBMITTED]: '/img/icons/status/yellow.svg',
        [CampaignStatus.REJECTED]: '/img/icons/status/red.svg',
        [CampaignStatus.APPROVED]: '/img/icons/status/blue.svg',
        [CampaignStatus.CONTRACT_CREATED]: '/img/icons/status/purple.svg',
        [CampaignStatus.CONTRACT_PUBLISHED]: '/img/icons/status/purple.svg',
        [CampaignStatus.CONTRACT_STARTED]: '/img/icons/status/purple.svg',
        [CampaignStatus.COUNTDOWN]: '/img/icons/status/orange.svg',
        [CampaignStatus.FUNDRAISING]: '/img/icons/status/green.svg',
        [CampaignStatus.FINISHING]: '/img/icons/status/green.svg',
        [CampaignStatus.ACTIVE]: '/img/icons/status/green.svg',
        [CampaignStatus.FAILED]: '/img/icons/status/red.svg',
        [CampaignStatus.UNREACHED]: '/img/icons/status/red.svg',
        [CampaignStatus.SUCCESS]: '/img/icons/status/gold.svg',
    };

    return statusImages[status as CampaignStatus] || '/img/icons/status/default.svg';
};

export const imageByStatusMilestone = (status: number): string => {
    const statusImages: Partial<Record<MilestoneStatus, string>> = {
        [MilestoneStatus.NOT_STARTED]: '/img/icons/status/yellow.svg',
        [MilestoneStatus.STARTED]: '/img/icons/status/yellow.svg',
        [MilestoneStatus.SUBMITTED]: '/img/icons/status/yellow.svg',
        [MilestoneStatus.REJECTED]: '/img/icons/status/red.svg',
        [MilestoneStatus.FINISHED]: '/img/icons/status/green.svg',
        [MilestoneStatus.FAILED]: '/img/icons/status/red.svg',
    };

    return statusImages[status as MilestoneStatus] || '/img/icons/status/default.svg';
};

/* export const getInternalId = (milestoneStatusId: string | undefined, milestoneStatus: MilestoneStatusGlobal[]): number | undefined => {
    const status = milestoneStatus.find((status) => status.id === milestoneStatusId);
    return status?.id;
}; */
//--------------------------------------------------------------
