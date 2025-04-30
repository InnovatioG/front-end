import { CampaignStatus_Code_Id_Enums, MilestoneStatus_Code_Id_Enums } from './status';

//--------------------------------------------------------------

export const StylesByCampaignStatus_Code_Id = (code_id: CampaignStatus_Code_Id_Enums, styles: { [key: string]: string; }): string => {
    const statusStyles: Record<CampaignStatus_Code_Id_Enums, string> = {
        [CampaignStatus_Code_Id_Enums.NOT_STARTED]: styles.notStarted,
        [CampaignStatus_Code_Id_Enums.CREATED]: styles.created,
        [CampaignStatus_Code_Id_Enums.SUBMITTED]: styles.submitted,
        [CampaignStatus_Code_Id_Enums.REJECTED]: styles.rejected,
        [CampaignStatus_Code_Id_Enums.APPROVED]: styles.approved,
        [CampaignStatus_Code_Id_Enums.CONTRACT_CREATED]: styles.contractCreated,
        [CampaignStatus_Code_Id_Enums.CONTRACT_PUBLISHED]: styles.contractPublished,
        [CampaignStatus_Code_Id_Enums.CONTRACT_STARTED]: styles.contractStarted,
        [CampaignStatus_Code_Id_Enums.COUNTDOWN]: styles.countdown,
        [CampaignStatus_Code_Id_Enums.FUNDRAISING]: styles.fundraising,
        [CampaignStatus_Code_Id_Enums.FINISHING]: styles.finishing,
        [CampaignStatus_Code_Id_Enums.ACTIVE]: styles.active,
        [CampaignStatus_Code_Id_Enums.FAILED]: styles.failed,
        [CampaignStatus_Code_Id_Enums.UNREACHED]: styles.unreached,
        [CampaignStatus_Code_Id_Enums.SUCCESS]: styles.success,
    };

    if (statusStyles[code_id as CampaignStatus_Code_Id_Enums] === undefined) {
        throw new Error(`No style found for code_id: ${code_id}`);
    }

    return statusStyles[code_id as CampaignStatus_Code_Id_Enums];
};
//--------------------------------------------------------------

export const ImageByCampaignStatus_Code_Id = (code_id: CampaignStatus_Code_Id_Enums): string => {
    const statusImages: Record<CampaignStatus_Code_Id_Enums, string> = {
        [CampaignStatus_Code_Id_Enums.NOT_STARTED]: '/img/icons/status/yellow.svg',
        [CampaignStatus_Code_Id_Enums.CREATED]: '/img/icons/status/blue.svg',
        [CampaignStatus_Code_Id_Enums.SUBMITTED]: '/img/icons/status/yellow.svg',
        [CampaignStatus_Code_Id_Enums.REJECTED]: '/img/icons/status/red.svg',
        [CampaignStatus_Code_Id_Enums.APPROVED]: '/img/icons/status/blue.svg',
        [CampaignStatus_Code_Id_Enums.CONTRACT_CREATED]: '/img/icons/status/purple.svg',
        [CampaignStatus_Code_Id_Enums.CONTRACT_PUBLISHED]: '/img/icons/status/purple.svg',
        [CampaignStatus_Code_Id_Enums.CONTRACT_STARTED]: '/img/icons/status/purple.svg',
        [CampaignStatus_Code_Id_Enums.COUNTDOWN]: '/img/icons/status/orange.svg',
        [CampaignStatus_Code_Id_Enums.FUNDRAISING]: '/img/icons/status/green.svg',
        [CampaignStatus_Code_Id_Enums.FINISHING]: '/img/icons/status/green.svg',
        [CampaignStatus_Code_Id_Enums.ACTIVE]: '/img/icons/status/green.svg',
        [CampaignStatus_Code_Id_Enums.FAILED]: '/img/icons/status/red.svg',
        [CampaignStatus_Code_Id_Enums.UNREACHED]: '/img/icons/status/red.svg',
        [CampaignStatus_Code_Id_Enums.SUCCESS]: '/img/icons/status/gold.svg',
    };
    if (statusImages[code_id as CampaignStatus_Code_Id_Enums] === undefined) {
        throw new Error(`No image found for code_id: ${code_id}`);
    }
    return statusImages[code_id as CampaignStatus_Code_Id_Enums];
};
//--------------------------------------------------------------

export const StylesByMilestoneStatus_Code_Id = (code_id: MilestoneStatus_Code_Id_Enums): string => {
    const statusStyles: Record<MilestoneStatus_Code_Id_Enums, string> = {
        [MilestoneStatus_Code_Id_Enums.NOT_STARTED]: 'notStarted',
        [MilestoneStatus_Code_Id_Enums.STARTED]: 'started',
        [MilestoneStatus_Code_Id_Enums.SUBMITTED]: 'submitted',
        [MilestoneStatus_Code_Id_Enums.REJECTED]: 'rejected',
        [MilestoneStatus_Code_Id_Enums.COLLECT]: 'collect',
        [MilestoneStatus_Code_Id_Enums.FINISHED]: 'finished',
        [MilestoneStatus_Code_Id_Enums.FAILED]: 'failed',
    };

    if (statusStyles[code_id as MilestoneStatus_Code_Id_Enums] === undefined) {
        throw new Error(`No style found for code_id: ${code_id}`);
    }

    return statusStyles[code_id as MilestoneStatus_Code_Id_Enums];
};
//--------------------------------------------------------------

export const ImageByMilestoneStatus_Code_Id = (code_id: MilestoneStatus_Code_Id_Enums): string => {
    const statusImages: Record<MilestoneStatus_Code_Id_Enums, string> = {
        [MilestoneStatus_Code_Id_Enums.NOT_STARTED]: '/img/icons/status/yellow.svg',
        [MilestoneStatus_Code_Id_Enums.STARTED]: '/img/icons/status/blue.svg',
        [MilestoneStatus_Code_Id_Enums.SUBMITTED]: '/img/icons/status/blue.svg',
        [MilestoneStatus_Code_Id_Enums.REJECTED]: '/img/icons/status/red.svg',
        [MilestoneStatus_Code_Id_Enums.COLLECT]: '/img/icons/status/blue.svg',
        [MilestoneStatus_Code_Id_Enums.FINISHED]: '/img/icons/status/green.svg',
        [MilestoneStatus_Code_Id_Enums.FAILED]: '/img/icons/status/red.svg',
    };

    if (statusImages[code_id as MilestoneStatus_Code_Id_Enums] === undefined) {
        throw new Error(`No image found for code_id: ${code_id}`);
    }

    return statusImages[code_id as MilestoneStatus_Code_Id_Enums];
};
//--------------------------------------------------------------
