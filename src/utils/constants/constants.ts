import { DISCORD, FACEBOOK, INSTAGRAM, LINKEDIN, WEBSITE, TWITTER } from '@/utils/constants/images';

export enum SocialOptionsEnums {
    WEBSITE = 'website',
    FACEBOOK = 'facebook',
    INSTAGRAM = 'instagram',
    TWITTER = 'twitter',
    LINKEDIN = 'linkedin',
    DISCORD = 'discord',
}

export const SocialIcons = [
    { icon: WEBSITE, name: SocialOptionsEnums.WEBSITE },
    { icon: FACEBOOK, name: SocialOptionsEnums.FACEBOOK },
    { icon: INSTAGRAM, name: SocialOptionsEnums.INSTAGRAM },
    { icon: TWITTER, name: SocialOptionsEnums.TWITTER },
    { icon: LINKEDIN, name: SocialOptionsEnums.LINKEDIN },
    { icon: DISCORD, name: SocialOptionsEnums.DISCORD },
];

export enum CampaignViewForEnums {
    home = 'home',
    campaigns = 'campaigns',
    manage = 'manage',
}

export enum ModalEnums {
    walletConnect = 'wallectConnect',
    editSocialLink = 'editSocialLink',

    deleteCampaign = 'deleteCampaign',

    submitCampaign = 'submitCampaign',
    manageCampaignSubmissions = 'manageCampaignSubmissions',
    viewCampaignSubmissions = 'viewCampaignSubmissions',

    createSmartContracts = 'createSmartContracts',
    publishSmartContracts = 'publishSmartContracts',
    initializeCampaign = 'initializeCampaign',

    manageCampaignUTXOs = 'manageCampaignUTXOs',
    launchCampaign = 'launchCampaign',
    validateFundraisingStatus = 'validateFundraisingStatus',

    withdrawTokensFailed = 'withdrawTokensFailed',
    withdrawTokensUnreached = 'withdrawTokensUnreached',

    submitMilestone = 'submitMilestone',
    manageMilestoneSubmissions = 'manageMilestoneSubmissions',
    viewMilestoneSubmissions = 'viewMilestoneSubmissions',

    collectFunds = 'collectFunds',

    contactSupport = 'contactSupport',
}

export enum HandleEnums {
    saveCampaign = 'saveCampaign',
    featureCampaign = 'featureCampaign',
    unFeatureCampaign = 'unFeatureCampaign',
    archiveCampaign = 'archiveCampaign',
    unArchiveCampaign = 'unArchiveCampaign',
}
