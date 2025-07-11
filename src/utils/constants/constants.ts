import { DISCORD_ICON, FACEBOOK_ICON, INSTAGRAM_ICON, LINKEDIN_ICON, WEBSITE_ICON, TWITTER_ICON } from '@/utils/constants/images';
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
    { icon: WEBSITE_ICON, name: SocialLinksEnums.WEBSITE },
    { icon: FACEBOOK_ICON, name: SocialLinksEnums.FACEBOOK },
    { icon: INSTAGRAM_ICON, name: SocialLinksEnums.INSTAGRAM },
    { icon: TWITTER_ICON, name: SocialLinksEnums.TWITTER },
    { icon: LINKEDIN_ICON, name: SocialLinksEnums.LINKEDIN },
    { icon: DISCORD_ICON, name: SocialLinksEnums.DISCORD },
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
    INVEST = 'Invest',
    VALIDATE_FUNDRAISING_STATUS = 'Validate Fundraising Status',
    SUBMIT_MILESTONE = 'Submit Milestone',
    MANAGE_MILESTONE_SUBMISSIONS = 'Manage Milestone Submissions',
    VIEW_MILESTONE_SUBMISSIONS = 'View Milestone Submissions',
    COLLECT_FUNDS = 'Collect Funds',
    GETBACK_FUNDS = 'Getback Tokens Failed or Unreached',
    WITHDRAW_TOKENS = 'Withdraw Tokens Failed or Unreached',

    CONFIRM_TX = 'ConfirmTx',
    PROCESSING_TX = 'ProcessingTx',

    PROCESSING_TASK = 'ProcessingTask',

    SUCCESS = 'Success',
    CONTACT_SUPPORT = 'Contact Support',


}
//--------------------------------------------------------------

export enum HandlesEnums {
    SAVE_CAMPAIGN = 'Save Campaign',
    FEATURE_CAMPAIGN = 'Feature Campaign',
    UN_FEATURE_CAMPAIGN = 'unFeature Campaign',
    ARCHIVE_CAMPAIGN = 'Archive Campaign',
    UN_ARCHIVE_CAMPAIGN = 'unArchive Campaign',

    DELETE_CAMPAIGN = 'Delete Campaign',

    SUBMIT_CAMPAIGN = 'Submit Campaign',
    APPROVE_CAMPAIGN = 'Approve Campaign',
    REJECT_CAMPAIGN = 'Reject Campaign',

    CREATE_SMART_CONTRACTS = 'Create Smart Contracts',
    PUBLISH_SMART_CONTRACTS = 'Publish Smart Contracts',
    INITIALIZE_CAMPAIGN = 'Initialize Campaign',
    MANAGE_CAMPAIGN_UTXOS = 'Manage Campaign UTXOs',

    LAUNCH_CAMPAIGN = 'Launch Campaign',
    INVEST = 'Invest',
    SET_FUNDRAISING_STATUS = 'Set Fund Raising Status',

    SUBMIT_MILESTONE = 'Submit Milestone',
    APPROVE_MILESTONE = 'Approve Milestone',
    REJECT_MILESTONE = 'Reject Milestone',
    FAIL_MILESTONE = 'Fail Milestone',
    COLLECT_FUNDS = 'Collect Funds',
    GETBACK_FUNDS = 'GetBack Funds',
    WITHDRAW_TOKENS = 'Withdraw Tokens',

}

//--------------------------------------------------------------

export enum TaskEnums {
    CREATE_PROTOCOL = 'CreateProtocol',
    DELETE_PROTOCOL = 'DeleteProtocol',
    
    DELETE_CAMPAIGN = 'DeleteCampaignl',

    SYNC_PROTOCOL = 'SyncProtocol',
    CREATE_CAMPAIGN = 'CreateCampaign',
    CREATE_CONTRACTS_CAMPAIGN = 'CreateContractsCampaign',

}

//--------------------------------------------------------------

export const REQUESTED_MAX_ADA = 1000000n;
export const REQUESTED_MIN_PERCENTAGE_FROM_MAX = 0.8;
export const REQUESTED_DEFAULT_ADA = 150000n;
export const REQUESTED_MIN_ADA = 5000n;