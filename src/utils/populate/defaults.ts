import { CampaignStatus_Code_Id_Enums, MilestoneStatus_Code_Id_Enums, SubmissionStatus_Enums } from '../constants/status';

import campaignsPopulateJson from './campaigns-populate.json';
import deployJson from '../../../_smart_contracts/deploy.json';

export const CampaignStatusDefaultNames: Record<CampaignStatus_Code_Id_Enums, string> = {
    [CampaignStatus_Code_Id_Enums.NOT_STARTED]: 'Not Started',
    [CampaignStatus_Code_Id_Enums.CREATED]: 'Created',
    [CampaignStatus_Code_Id_Enums.SUBMITTED]: 'Submitted',
    [CampaignStatus_Code_Id_Enums.REJECTED]: 'Rejected',
    [CampaignStatus_Code_Id_Enums.APPROVED]: 'Approved',
    [CampaignStatus_Code_Id_Enums.CONTRACT_CREATED]: 'Contract Created',
    [CampaignStatus_Code_Id_Enums.CONTRACT_PUBLISHED]: 'Contract Published',
    [CampaignStatus_Code_Id_Enums.CONTRACT_STARTED]: 'Contract Started',
    [CampaignStatus_Code_Id_Enums.COUNTDOWN]: 'Countdown',
    [CampaignStatus_Code_Id_Enums.FUNDRAISING]: 'Fundraising',
    [CampaignStatus_Code_Id_Enums.FINISHING]: 'Finishing',
    [CampaignStatus_Code_Id_Enums.ACTIVE]: 'Active',
    [CampaignStatus_Code_Id_Enums.FAILED]: 'Failed',
    [CampaignStatus_Code_Id_Enums.UNREACHED]: 'Unreached',
    [CampaignStatus_Code_Id_Enums.SUCCESS]: 'Success',
};

export const MilestoneStatusDefaultNames: Record<MilestoneStatus_Code_Id_Enums, string> = {
    [MilestoneStatus_Code_Id_Enums.NOT_STARTED]: 'Not Started',
    [MilestoneStatus_Code_Id_Enums.STARTED]: 'Started',
    [MilestoneStatus_Code_Id_Enums.SUBMITTED]: 'Submitted',
    [MilestoneStatus_Code_Id_Enums.REJECTED]: 'Rejected',
    [MilestoneStatus_Code_Id_Enums.COLLECT]: 'Collect',
    [MilestoneStatus_Code_Id_Enums.FINISHED]: 'Finished',
    [MilestoneStatus_Code_Id_Enums.FAILED]: 'Failed',
};

export const SubmissionStatusDefaultNames: Record<SubmissionStatus_Enums, string> = {
    [SubmissionStatus_Enums.SUBMITTED]: 'Submitted',
    [SubmissionStatus_Enums.APPROVED]: 'Approved',
    [SubmissionStatus_Enums.REJECTED]: 'Rejected',
    [SubmissionStatus_Enums.FAILED]: 'Failed',
};

export enum CampaignCategoryDefault {
    TECHNOLOGY = 1,
    EVENT = 2,
    EDUCATION = 3,
    GAMING = 4,
    SOCIAL = 5,
    FOOD = 6,
    HOUSING = 7,
    ENERGY = 8,
    HEALTH = 9,
    ENVIRONMENT = 10,
}

export const CampaignCategoryDefaultNames: Record<CampaignCategoryDefault, string> = {
    [CampaignCategoryDefault.TECHNOLOGY]: 'Technology',
    [CampaignCategoryDefault.EVENT]: 'Event',
    [CampaignCategoryDefault.EDUCATION]: 'Education',
    [CampaignCategoryDefault.GAMING]: 'Gaming',
    [CampaignCategoryDefault.SOCIAL]: 'Social',
    [CampaignCategoryDefault.FOOD]: 'Food',
    [CampaignCategoryDefault.HOUSING]: 'Housing',
    [CampaignCategoryDefault.ENERGY]: 'Energy',
    [CampaignCategoryDefault.HEALTH]: 'Health',
    [CampaignCategoryDefault.ENVIRONMENT]: 'Environment',
};

export const protocolDefault = {
    name: 'INNOVATIO',
    deployJson: deployJson,
    campaignsPopulateJson: campaignsPopulateJson,
};
