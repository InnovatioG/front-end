import { DISCORD, FACEBOOK, INSTAGRAM, LINKEDIN, WEBSITE, TWITTER } from '@/utils/constants/images';
//--------------------------------------------------------------

export enum SocialLinksEnums {
    WEBSITE = 'website',
    FACEBOOK = 'facebook',
    INSTAGRAM = 'instagram',
    TWITTER = 'twitter',
    LINKEDIN = 'linkedin',
    DISCORD = 'discord',
}
//--------------------------------------------------------------

export const SocialLinksIcons = [
    { icon: WEBSITE, name: SocialLinksEnums.WEBSITE },
    { icon: FACEBOOK, name: SocialLinksEnums.FACEBOOK },
    { icon: INSTAGRAM, name: SocialLinksEnums.INSTAGRAM },
    { icon: TWITTER, name: SocialLinksEnums.TWITTER },
    { icon: LINKEDIN, name: SocialLinksEnums.LINKEDIN },
    { icon: DISCORD, name: SocialLinksEnums.DISCORD },
];

//--------------------------------------------------------------

export enum ModalsEnums {
    WALLET_CONNECT = 'Wallet Connect',
    EDIT_CONTENTS = 'Edit Contents',
    EDIT_MEMBERS = 'Edit Members',
    EDIT_SOCIAL_LINK = 'Edit Social Link',
    DELETE_CAMPAIGN = 'Delete Campaign',
    SUBMIT_CAMPAIGN = 'Submit Campaign',
    MANAGE_CAMPAIGN_SUBMISSIONS = 'Manage Campaign Submissions',
    VIEW_CAMPAIGN_SUBMISSIONS = 'View Campaign Submissions',
    CREATE_SMART_CONTRACTS = 'Create Smart Contracts',
    PUBLISH_SMART_CONTRACTS = 'Publish Smart Contracts',
    INITIALIZE_CAMPAIGN = 'Initialize Campaign',
    MANAGE_CAMPAIGN_UTXOS = 'Manage Campaign UTXOs',
    LAUNCH_CAMPAIGN = 'Launch Campaign',
    VALIDATE_FUNDRAISING_STATUS = 'Validate Fundraising Status',
    WITHDRAW_TOKENS_FAILED = 'Withdraw Tokens Failed',
    WITHDRAW_TOKENS_UNREACHED = 'Withdraw Tokens Unreached',
    GETBACK_TOKENS_FAILED = 'Getback Tokens Failed',
    GETBACK_TOKENS_UNREACHED = 'Getback Tokens Unreached',
    SUBMIT_MILESTONE = 'Submit Milestone',
    MANAGE_MILESTONE_SUBMISSIONS = 'Manage Milestone Submissions',
    VIEW_MILESTONE_SUBMISSIONS = 'View Milestone Submissions',
    COLLECT_FUNDS = 'Collect Funds',
    CONTACT_SUPPORT = 'Contact Support',

    SUCCESS = 'Success',

    CONFIRM_TX = 'ConfirmTx',
    PROCESSING_TX = 'Processing',



}
//--------------------------------------------------------------

export enum HandlesEnums {
    SAVE_CAMPAIGN = 'Save Campaign',
    FEATURE_CAMPAIGN = 'Feature Campaign',
    UN_FEATURE_CAMPAIGN = 'unFeature Campaign',
    ARCHIVE_CAMPAIGN = 'Archive Campaign',
    UN_ARCHIVE_CAMPAIGN = 'unArchive Campaign',

    SUBMIT_CAMPAIGN = 'Submit Campaign',
    APPROVE_CAMPAIGN = 'Approve Campaign',
    REJECT_CAMPAIGN = 'Reject Campaign',

    CREATE_SMART_CONTRACTS = 'Create Smart Contracts',
    PUBLISH_SMART_CONTRACTS = 'Publish Smart Contracts',
    INITIALIZE_CAMPAIGN = 'Initialize Campaign',
    LAUNCH_CAMPAIGN = 'Launch Campaign',

    SET_FUNDRAISING_STATUS = 'Set Fundraising Status',
    SET_FINISHING_STATUS = 'Set Finishing Status',
    SET_REACHED_STATUS = 'Set Reached Status',
    SET_UNREACHED_STATUS = 'Set Unreached Status',
    SET_FAILED_STATUS = 'Set Failed Status',

}

//--------------------------------------------------------------


export const REQUESTED_MAX_ADA = 1000000n;
export const REQUESTED_MIN_PERCENTAGE_FROM_MAX = 0.8;
export const REQUESTED_DEFAULT_ADA = 150000n;
export const REQUESTED_MIN_ADA = 20000n;