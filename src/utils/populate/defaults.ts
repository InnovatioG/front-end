import { CampaignStatus_Code_Id, MilestoneStatus_Code_Id, SubmissionStatus } from '../constants/status';

import campaignsPopulateJson from './campaigns-populate.json';
import deployJson from '../../../_smart_contracts/deploy.json';

export const CampaignStatusDefaultNames: Record<CampaignStatus_Code_Id, string> = {
    [CampaignStatus_Code_Id.NOT_STARTED]: 'Not Started',
    [CampaignStatus_Code_Id.CREATED]: 'Created',
    [CampaignStatus_Code_Id.SUBMITTED]: 'Submitted',
    [CampaignStatus_Code_Id.REJECTED]: 'Rejected',
    [CampaignStatus_Code_Id.APPROVED]: 'Approved',
    [CampaignStatus_Code_Id.CONTRACT_CREATED]: 'Contract Created',
    [CampaignStatus_Code_Id.CONTRACT_PUBLISHED]: 'Contract Published',
    [CampaignStatus_Code_Id.CONTRACT_STARTED]: 'Contract Started',
    [CampaignStatus_Code_Id.COUNTDOWN]: 'Countdown',
    [CampaignStatus_Code_Id.FUNDRAISING]: 'Fundraising',
    [CampaignStatus_Code_Id.FINISHING]: 'Finishing',
    [CampaignStatus_Code_Id.ACTIVE]: 'Active',
    [CampaignStatus_Code_Id.FAILED]: 'Failed',
    [CampaignStatus_Code_Id.UNREACHED]: 'Unreached',
    [CampaignStatus_Code_Id.SUCCESS]: 'Success',
};

export const MilestoneStatusDefaultNames: Record<MilestoneStatus_Code_Id, string> = {
    [MilestoneStatus_Code_Id.NOT_STARTED]: 'Not Started',
    [MilestoneStatus_Code_Id.STARTED]: 'Started',
    [MilestoneStatus_Code_Id.SUBMITTED]: 'Submitted',
    [MilestoneStatus_Code_Id.REJECTED]: 'Rejected',
    [MilestoneStatus_Code_Id.COLLECT]: 'Collect',
    [MilestoneStatus_Code_Id.FINISHED]: 'Finished',
    [MilestoneStatus_Code_Id.FAILED]: 'Failed',
};

export const SubmissionStatusDefaultNames: Record<SubmissionStatus, string> = {
    [SubmissionStatus.SUBMITTED]: 'Submitted',
    [SubmissionStatus.APPROVED]: 'Approved',
    [SubmissionStatus.REJECTED]: 'Rejected',
    [SubmissionStatus.FAILED]: 'Failed',
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
