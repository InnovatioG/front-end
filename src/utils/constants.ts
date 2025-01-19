import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';
import { DISCORD, FACEBOOK, INSTAGRAM, LINKEDIN, WEBSITE, XS } from '@/utils/images';
import { CampaignStatus } from '@/utils/constants/status';

export const socialIcons = [
    { icon: WEBSITE, name: 'website' },
    { icon: FACEBOOK, name: 'facebook' },
    { icon: INSTAGRAM, name: 'instagram' },
    { icon: XS, name: 'xs' },
    { icon: LINKEDIN, name: 'linkedin' },
    { icon: DISCORD, name: 'discord' },
];

export const memberFields = [
    { key: 'name', placeholder: 'Name' },
    { key: 'last_name', placeholder: 'Last name' },
    { key: 'role', placeholder: 'Role' },
];
export const titleForCampaignCreation = (step: number): string => {
    if (step !== 4) {
        return "Let's start with the initial description";
    } else {
        return 'Present your team members :)';
    }
};

export const initialTextEditorOptions = [
    {
        order: 1,
        name: "What's the product?",
        tooltip:
            "In this section, you should provide a clear and concise description of your product, service, or project. Answer questions like what it is, what it does, If it's a physical product, describe its key features and how it benefits the user. If it's a service, explain what it entails and how it satisfies a need or solves a specific problem.",
    },
    {
        order: 2,
        name: "What's your value?",
        tooltip:
            "In this section, highlight the unique and valuable aspects of your digital product, service, or project. Explore how it stands out from other available options in the market and why it's a superior choice. This may include distinctive features, additional benefits, competitive advantages, or core values that support your proposal.",
    },
    {
        order: 3,
        name: 'How it works?',

        tooltip:
            "In this section, explain how your product, service, or project operates in practice. Detail the steps or processes involved, from acquisition to use or implementation. If it's a product, describe how it's used and what benefits it offers to users. If it's a service, explain how it's delivered and how customers can access it. If it's a project, describe how it will be carried out and what stages or milestones it will involve.",
    },
    {
        order: 4,
        name: 'Marketing Strategy',
        tooltip:
            "In this section, describe your general strategy to promote and market your digital product, service, or project. Explore the marketing channels you will utilize, such as social media, email marketing, digital advertising, etc. Detail your specific tactics, like content creation, participation in events, collaboration with influencers, etc. It's also helpful to explain how you will measure and evaluate the success of your marketing efforts.",
        active: false,
    },
];

export const inputFieldsToken = (project: any) => [
    {
        id: 'cdCampaignToken_TN',
        label: 'Token Tick Name',
        type: 'text',
        placeholder: '$ADA',
        value: project.cdCampaignToken_TN,
        transform: (value: string) => value,
    },
    {
        id: 'cdRequestedMaxADA',
        label: 'Quantity and Value per token',
        type: 'number',
        placeholder: 'Quantity',
        value: project.cdRequestedMaxADA ?? '',
        transform: (value: string) => (value ? Number(value) : null),
    },
    /*   {
    id: "cdCampaignToken_PriceADA",
    label: "Value per token",
    type: "read",
    placeholder: "$ADA",
    value: project.cdCampaignToken_PriceADA ?? "",
    transform: (value: string) => (value ? Number(value) : null),
  }, */
];

interface StateConfig {
    label: string;
    buttons: ButtonType[];
    milestone_status_id?: number;
    protocol_team?: boolean;
}

export interface ButtonType {
    id: number;
    label: string;
    action?: (setModalOpen?: (modalType: string) => void, project?: any) => void;
    link?: (id: number) => string;
    classNameType: string;
}

export const buttonTypes: { [key: string]: ButtonType } = {
    VIEW_CAMPAIGN: {
        id: 1,
        label: 'View Campaign',
        action: () => {},
        link: (id: number) => `/campaign/${id}`,
        classNameType: 'outline-card',
    },
    SEND_TO_REVISION: {
        id: 2,
        label: 'Send to Revision',
        action: () => alert('Api enviando la campaña a revision'),
        classNameType: 'fill',
    },
    VIEW_REPORT: {
        id: 3,
        label: 'View Report',
        action: (setModalOpen) => {
            if (setModalOpen) setModalOpen('viewReport');
        },
        classNameType: 'fill',
    },
    PRE_LAUNCH: {
        id: 4,
        label: "Your campaign is accepted, let's launch it",
        action: () => console.log('llamado a la api para lanzar la campaña'),
        classNameType: 'outline-card',
    },
    LAUNCH_CAMPAIGN: {
        id: 5,
        label: 'Launch Campaign',
        action: (setModalOpen) => {
            if (setModalOpen) setModalOpen('launchCampaign');
        },
        classNameType: 'fill',
    },
    MANAGE_CAMPAIGN: {
        id: 6,
        label: 'Manage Campaign',
        action: (setModalOpen) => {
            if (setModalOpen) setModalOpen('manageCampaign');
        },
        classNameType: 'fill',
    },
    EDIT_CAMPAIGN: {
        id: 7,
        label: 'Edit Campaign',
        action: () => {},
        link: (id: number) => `/campaign/edit?id=${id}`,
        classNameType: 'fill',
    },
    CREATE_CONTRACT: {
        id: 8,
        label: 'Create Contract',
        action: (setModalOpen) => {
            if (setModalOpen) setModalOpen('createSmartContract');
        },
        classNameType: 'fill',
    },
    PUBLISH_CONTRACT: {
        id: 9,
        label: 'Publish Contract',
        action: (setModalOpen) => {
            if (setModalOpen) setModalOpen('publishSmartContract');
        },
        classNameType: 'fill',
    },
    INITIALIZE_CAMPAIGN: {
        id: 10,
        label: 'Initialize Campaign',
        action: (setModalOpen) => {
            if (setModalOpen) setModalOpen('initializeCampaign');
        },
        classNameType: 'fill',
    },
    LAUNCH_CAMPAIGN_B: {
        id: 11,
        label: 'Launch Campaign',
        action: (setModalOpen) => {
            if (setModalOpen) setModalOpen('launchCampaign');
        },

        classNameType: 'fill',
    },
    VALIDATE_FUNDRAISING_STATUS: {
        id: 12,
        label: 'Validate Fundraising Status (TX)',
        action: (setModalOpen) => {
            if (setModalOpen) setModalOpen('validateFundraisingStatus');
        },
        classNameType: 'fill',
    },
    CONTACT_TEAM_SUPPORT: {
        id: 13,
        label: 'Contact Team Support',
        action: (setModalOpen) => {
            if (setModalOpen) setModalOpen('contactSupport');
        },
        classNameType: 'fill',
    },
    INVEST: {
        id: 14,
        label: 'Invest',
        action: (project) => {
            localStorage.setItem('project', JSON.stringify(project));
        },
        link: (id: number) => '/invest',
        classNameType: 'invest',
    },
    WITHDRAW: {
        id: 15,
        label: 'Withdraw Tokens',
        action: (setModalOpen) => {
            if (setModalOpen) setModalOpen('withdrawTokens');
        },
        classNameType: 'fillb',
    },
};
export const ButtonsForCampaignPage = (state_id: number, isProtocolTeam: boolean, isAdmin: boolean): StateConfig => {
    const state: { [key: number]: StateConfig } = {
        [CampaignStatus.CREATED]: {
            label: 'Draft', // Created
            buttons: [
                buttonTypes.SEND_TO_REVISION, // Send to Revision
            ],
        },
        [CampaignStatus.SUBMITTED]: {
            label: 'Submitted', // Submitted
            buttons: [
                buttonTypes.CONTACT_TEAM_SUPPORT, // Contact Support Team
            ],
        },
        [CampaignStatus.REJECTED]: {
            label: 'Rejected', // Rejected
            buttons: [
                buttonTypes.VIEW_REPORT, // View Report
            ],
        },
        [CampaignStatus.APPROVED]: {
            label: 'Approved', // Approved
            buttons: [
                buttonTypes.PRE_LAUNCH, // Launch Campaign
            ],
        },
        [CampaignStatus.CONTRACT_CREATED]: {
            label: 'Created', // Contract Created
            buttons: [
                buttonTypes.CONTACT_TEAM_SUPPORT, // Contact Support Team
            ],
        },
        [CampaignStatus.CONTRACT_PUBLISHED]: {
            label: 'Deploy', // Contract Published
            buttons: [
                buttonTypes.CONTACT_TEAM_SUPPORT, // Contact Support Team
            ],
        },
        [CampaignStatus.CONTRACT_STARTED]: {
            label: 'Ready', // Contract Started
            buttons: [
                buttonTypes.LAUNCH_CAMPAIGN, // Contact Support Team
            ],
        },
        [CampaignStatus.COUNTDOWN]: {
            label: 'Countdown', // Countdown
            buttons: [
                buttonTypes.CONTACT_TEAM_SUPPORT, // Contact Support Team
            ],
        },
        [CampaignStatus.FUNDRAISING]: {
            label: 'Fundraising',
            buttons: isAdmin
                ? [buttonTypes.CONTACT_TEAM_SUPPORT] // Contact Support Team
                : isProtocolTeam
                ? [buttonTypes.CONTACT_TEAM_SUPPORT] // Protocol Team Button
                : [buttonTypes.INVEST], // Default Button
        },
    };
    return state[state_id] || { label: 'Not Started', buttons: [] };
};

export const CardInformationByState = (state_id: number, milestone_status_id?: number, isAdmin?: boolean): StateConfig => {
    const { setMenuView } = useCampaignIdStore();

    const state: { [key: number]: StateConfig } = {
        [CampaignStatus.NOT_STARTED]: {
            label: 'Draft', // Created
            buttons: [
                {
                    id: 1,
                    label: 'View Campaign',
                    action: () => {},
                    link: (id: number) => `/campaign/${id}`,
                    classNameType: 'outline-card',
                },
                buttonTypes.SEND_TO_REVISION,
            ],
        },
        [CampaignStatus.CREATED]: {
            label: 'Submitted', // Submitted
            buttons: [
                buttonTypes.VIEW_CAMPAIGN, // View Campaign
            ],
        },
        [CampaignStatus.SUBMITTED]: {
            label: 'Rejected', // Rejected
            buttons: [
                buttonTypes.VIEW_REPORT, // View report
            ],
        },
        [CampaignStatus.REJECTED]: {
            label: 'Approved', // Approved
            buttons: [
                buttonTypes.VIEW_CAMPAIGN, // View Campaign
            ],
        },
        [CampaignStatus.APPROVED]: {
            label: 'Created', // Contract Created
            buttons: [
                buttonTypes.VIEW_CAMPAIGN, // View Campaign
            ],
        },
        [CampaignStatus.CONTRACT_CREATED]: {
            label: 'Deploy', // Contract Published
            buttons: [
                buttonTypes.VIEW_CAMPAIGN, // View Campaign
            ],
        },
        [CampaignStatus.CONTRACT_PUBLISHED]: {
            label: 'Ready', // Contract Started
            buttons: [
                buttonTypes.VIEW_CAMPAIGN, // View Campaign
                buttonTypes.LAUNCH_CAMPAIGN, // Launch Campaign (tx)
            ],
        },
        [CampaignStatus.COUNTDOWN]: {
            label: 'Countdown', // Countdown
            buttons: [
                buttonTypes.VIEW_CAMPAIGN, // View Campaign
            ],
        },
        [CampaignStatus.FUNDRAISING]: {
            label: 'Fundraising', // Fundraising
            buttons: [
                buttonTypes.VIEW_CAMPAIGN, // View Campaign
            ],
        },
        [CampaignStatus.FINISHING]: {
            label: 'Finishing',
            buttons: [
                buttonTypes.VALIDATE_FUNDRAISING_STATUS, // Validate Fundraising Status (TX)
            ],
        },
        [CampaignStatus.ACTIVE]: isAdmin
            ? milestone_status_id
                ? ButtonsByMilestoneStatus(milestone_status_id)
                : { label: 'Active', buttons: [] }
            : { label: 'Active', buttons: [] },
        [CampaignStatus.FAILED]: {
            label: 'Failed',
            buttons: [buttonTypes.WITHDRAW],
        },
        [CampaignStatus.UNREACHED]: {
            label: 'Unreached',
            buttons: [buttonTypes.WITHDRAW],
        },
        [CampaignStatus.SUCCESS]: {
            label: 'Succesfull',
            buttons: [
                buttonTypes.VIEW_CAMPAIGN, // View Campaign
            ],
        },
    };

    return state[state_id] || { label: 'Not Started', buttons: [] };
};

export const cardInformationForProtocolTeam = (state_id: number): StateConfig => {
    const state: { [key: number]: StateConfig } = {
        [CampaignStatus.SUBMITTED]: {
            label: 'Attempmt to Launch', // Submitted
            buttons: [
                buttonTypes.VIEW_CAMPAIGN, // View Campaign
                buttonTypes.MANAGE_CAMPAIGN, // Manage Campaign
            ],
        },
        [CampaignStatus.REJECTED]: {
            label: 'Rejected', // Rejected
            buttons: [
                buttonTypes.VIEW_CAMPAIGN, // View report
                buttonTypes.EDIT_CAMPAIGN, // Edit Campaign
            ],
        },
        [CampaignStatus.APPROVED]: {
            label: 'Approved', // Approved
            buttons: [
                buttonTypes.VIEW_CAMPAIGN, // View Campaign
                buttonTypes.CREATE_CONTRACT, // Create Contract
            ],
        },
        [CampaignStatus.CONTRACT_CREATED]: {
            label: 'Created', // Contract Created
            buttons: [
                buttonTypes.VIEW_CAMPAIGN, // View Campaign
                buttonTypes.PUBLISH_CONTRACT, // Publish Contract
            ],
        },
        [CampaignStatus.CONTRACT_PUBLISHED]: {
            label: 'Deploy', // Contract Published
            buttons: [
                buttonTypes.VIEW_CAMPAIGN, // View Campaign
                buttonTypes.INITIALIZE_CAMPAIGN, // Initialize Campaign + modal
            ],
        },
        [CampaignStatus.CONTRACT_STARTED]: {
            label: 'Ready', // Contract Started
            buttons: [
                buttonTypes.VIEW_CAMPAIGN, // View Campaign
                buttonTypes.LAUNCH_CAMPAIGN_B, // Launch Campaign
            ],
        },
        [CampaignStatus.COUNTDOWN]: {
            label: 'Countdown', // Countdown
            buttons: [
                buttonTypes.VIEW_CAMPAIGN, // View Campaign
            ],
        },
        [CampaignStatus.FUNDRAISING]: {
            label: 'Fundraising', // Fundraising
            buttons: [
                buttonTypes.VIEW_CAMPAIGN, // View Campaign
            ],
        },
        [CampaignStatus.FINISHING]: {
            label: 'Finishing',
            buttons: [
                buttonTypes.VALIDATE_FUNDRAISING_STATUS, // Validate Fundraising Status (TX)
            ],
        },
    };

    return state[state_id] || { label: 'Not Started', buttons: [] };
};

export const ButtonsByMilestoneStatus = (milestone_status_id: number): StateConfig => {
    /*     const { setMenuView } = useCampaignIdStore();
     */ const state: { [key: number]: StateConfig } = {
        2: {
            label: 'Active',
            buttons: [
                {
                    id: 1,
                    label: 'View Campaign',
                    action: () => {},
                    link: (id: number) => `/campaign/${id}`,
                    classNameType: 'outline-card',
                },
                {
                    id: 2,
                    label: 'Send Report',
                    action: (setModalOpen) => {
                        if (setModalOpen) setModalOpen('sendReport');
                    },
                    classNameType: 'fill',
                },
            ],
        },
        3: {
            label: 'Reported',
            buttons: [
                {
                    id: 3,
                    label: 'View Report',
                    action: () => {
                        /*                         setMenuView('Roadmap & Milestones');
                         */
                    },
                    link: (id: number) => `/campaign/${id}`,
                    classNameType: 'fill',
                },
            ],
        },
        4: {
            label: 'Rejected',
            buttons: [
                buttonTypes.VIEW_CAMPAIGN,
                {
                    id: 4,
                    label: 'Send Report',
                    action: (setModalOpen) => {
                        if (setModalOpen) setModalOpen('sendReport');
                    },
                    classNameType: 'fill',
                },
            ],
        },
        5: {
            label: 'Collect',
            buttons: [
                buttonTypes.VIEW_CAMPAIGN,

                {
                    id: 5,
                    label: 'Collect Milestones Founds',
                    action: (setModalOpen) => {
                        if (setModalOpen) setModalOpen('collect');
                    },
                    classNameType: 'fill',
                },
            ],
        },
    };

    return state[milestone_status_id] || { label: 'Unknown', buttons: [] };
};
