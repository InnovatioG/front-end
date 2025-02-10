import { DISCORD, FACEBOOK, INSTAGRAM, LINKEDIN, WEBSITE, TWITTER } from '@/utils/constants/images';

export enum SocialOptions {
    WEBSITE = 'website',     
    FACEBOOK = 'facebook',   
    INSTAGRAM = 'instagram', 
    TWITTER = 'twitter',     
    LINKEDIN = 'linkedin',   
    DISCORD = 'discord'
}

export const SocialIcons = [
    { icon: WEBSITE, name: SocialOptions.WEBSITE },
    { icon: FACEBOOK, name: SocialOptions.FACEBOOK },
    { icon: INSTAGRAM, name: SocialOptions.INSTAGRAM },
    { icon: TWITTER, name: SocialOptions.TWITTER },
    { icon: LINKEDIN, name: SocialOptions.LINKEDIN },
    { icon: DISCORD, name: SocialOptions.DISCORD },
];

