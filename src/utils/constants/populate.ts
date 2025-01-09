import { CampaignStatus, MilestoneStatus, SubmissionStatus } from './status';

import campaignsJson from './campaigns.json';
import configJson from './deploy.json';

export const CampaignStatusDefaultNames: Record<CampaignStatus, string> = {
    [CampaignStatus.NOT_STARTED]: 'Not Started',
    [CampaignStatus.CREATED]: 'Created',
    [CampaignStatus.SUBMITTED]: 'Submitted',
    [CampaignStatus.REJECTED]: 'Rejected',
    [CampaignStatus.APPROVED]: 'Approved',
    [CampaignStatus.CONTRACT_CREATED]: 'Contract Created',
    [CampaignStatus.CONTRACT_PUBLISHED]: 'Contract Published',
    [CampaignStatus.CONTRACT_STARTED]: 'Contract Started',
    [CampaignStatus.COUNTDOWN]: 'Countdown',
    [CampaignStatus.FUNDRAISING]: 'Fundraising',
    [CampaignStatus.FINISHING]: 'Finishing',
    [CampaignStatus.ACTIVE]: 'Active',
    [CampaignStatus.FAILED]: 'Failed',
    [CampaignStatus.UNREACHED]: 'Unreached',
    [CampaignStatus.SUCCESS]: 'Success',
};

export const MilestoneStatusDefaultNames: Record<MilestoneStatus, string> = {
    [MilestoneStatus.NOT_STARTED]: 'Not Started',
    [MilestoneStatus.STARTED]: 'Started',
    [MilestoneStatus.SUBMITTED]: 'Submitted',
    [MilestoneStatus.REJECTED]: 'Rejected',
    [MilestoneStatus.FINISHED]: 'Finished',
    [MilestoneStatus.FAILED]: 'Failed',
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
    configJson: configJson,
    campaignsJson: campaignsJson,
};
