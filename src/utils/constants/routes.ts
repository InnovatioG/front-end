export const ROUTES = {
    home: '/',
    campaigns: '/campaigns',
    campaignNew: '/campaigns/new',
    campaignDetails: (id: string) => `/campaigns/${id}`,
    campaignTab: (id: string, tab: CampaignTab= CampaignTab.DETAILS) => `/campaigns/${id}/${CampaignTabUrls[tab]}`,
    campaignEdit: (id: string) => `/campaigns/edit/${id}`,
    campaignInvest: (id: string) => `/campaigns/invest/${id}`,
    manage: '/campaigns/manage',
    aboutus: '/about-us',
    howitworks: '/how-it-works',
    investment: '/',
    airdropSale: '/',
    airdropResale: '/',
    innovatio: '/',
    partnerships: '/',
    contact: '/',
    joinUs: '/',
    stakePoolDelegation: '/',
    discordCommunity: '/',
    facebook: '/',
    instagram: '/',
    twitter: '/',
    discord: '/',
};

export enum CampaignTab {
    DETAILS = 'Campaign Detail',
    MEMBERS = 'Resume of the team',
    ROADMAP = 'Roadmap & Milestones',
    TOKENOMICS = 'Tokenomics',
    QA = 'Q&A',
}

export const CampaignTabUrls: Record<CampaignTab, string> = {
    [CampaignTab.DETAILS]: 'details',
    [CampaignTab.MEMBERS]: 'members',
    [CampaignTab.ROADMAP]: 'roadmap',
    [CampaignTab.TOKENOMICS]: 'tokenomics',
    [CampaignTab.QA]: 'qa',
};          
