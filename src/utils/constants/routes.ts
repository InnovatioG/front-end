
//--------------------------------------------------------------

export const ROUTES = {
    home: '/',
    campaigns: '/campaigns',
    campaignCreation: '/campaigns/new',
    campaignView: (id: string) => `/campaigns/${id}`,
    campaignViewTab: (id: string, tab: CampaignTabEnum = CampaignTabEnum.DETAILS) => `/campaigns/${id}/${CampaignTabUrls[tab]}`,
    campaignManage: (id: string) => `/campaigns/manage/${id}`,
    campaignManageTab: (id: string, tab: CampaignTabEnum = CampaignTabEnum.DETAILS) => `/campaigns/manage/${id}/${CampaignTabUrls[tab]}`,
    campaignEdit: (id: string) => `/campaigns/manage/edit/${id}`,
    campaignEditTab: (id: string, tab: CampaignTabEnum = CampaignTabEnum.DETAILS) => `/campaigns/manage/edit/${id}/${CampaignTabUrls[tab]}`,
    campaignDynamicTab: (
        id: string,
        tab: CampaignTabEnum = CampaignTabEnum.DETAILS,
        pageView: PageViewEnums,
        isEditMode: boolean
    ): string => {
        if (pageView === PageViewEnums.MANAGE) {
            return isEditMode
                ? ROUTES.campaignEditTab(id, tab)
                : ROUTES.campaignManageTab(id, tab);
        }
        return ROUTES.campaignViewTab(id, tab);
    },
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

//--------------------------------------------------------------

export enum CampaignTabEnum {
    DETAILS = 'Campaign Detail',
    MEMBERS = 'Resume of the team',
    ROADMAP = 'Roadmap & Milestones',
    TOKENOMICS = 'Tokenomics',
    FAQS = 'FAQS',
}

export const CampaignTabUrls: Record<CampaignTabEnum, string> = {
    [CampaignTabEnum.DETAILS]: 'details',
    [CampaignTabEnum.MEMBERS]: 'members',
    [CampaignTabEnum.ROADMAP]: 'roadmap',
    [CampaignTabEnum.TOKENOMICS]: 'tokenomics',
    [CampaignTabEnum.FAQS]: 'faqs',
};

//--------------------------------------------------------------

export enum PageViewEnums {
    HOME = 'HOME',
    CAMPAIGNS = 'CAMPAIGNS',
    MANAGE = 'MANAGE',
    INVEST = 'INVEST'
}

//--------------------------------------------------------------