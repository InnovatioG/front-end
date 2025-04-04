import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
import { DISCORD, FACEBOOK, INSTAGRAM, LINKEDIN, WEBSITE, XS } from '@/utils/images';

export const categories: string[] = ['Technology', 'Event', 'Education', 'Gaming', 'Social', 'Food'];

export const socialIcons = [
    { icon: WEBSITE, name: 'website' },
    { icon: FACEBOOK, name: 'facebook' },
    { icon: INSTAGRAM, name: 'instagram' },
    { icon: XS, name: 'xs' },
    { icon: LINKEDIN, name: 'linkedin' },
    { icon: DISCORD, name: 'discord' },
];

export const memberFields = [
    { key: 'member_name', placeholder: 'Name' },
    { key: 'member_last_name', placeholder: 'Last name' },
    { key: 'member_role', placeholder: 'Role' },
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
        id: 1,
        title: "What's the product?",
        tooltip:
            "In this section, you should provide a clear and concise description of your product, service, or project. Answer questions like what it is, what it does, If it's a physical product, describe its key features and how it benefits the user. If it's a service, explain what it entails and how it satisfies a need or solves a specific problem.",
    },
    {
        id: 2,
        title: "What's your value?",
        tooltip:
            "In this section, highlight the unique and valuable aspects of your digital product, service, or project. Explore how it stands out from other available options in the market and why it's a superior choice. This may include distinctive features, additional benefits, competitive advantages, or core values that support your proposal.",
    },
    {
        id: 3,
        title: 'How it works?',
        tooltip:
            "In this section, explain how your product, service, or project operates in practice. Detail the steps or processes involved, from acquisition to use or implementation. If it's a product, describe how it's used and what benefits it offers to users. If it's a service, explain how it's delivered and how customers can access it. If it's a project, describe how it will be carried out and what stages or milestones it will involve.",
    },
    {
        id: 4,
        title: 'Marketing Strategy',
        tooltip:
            "In this section, describe your general strategy to promote and market your digital product, service, or project. Explore the marketing channels you will utilize, such as social media, email marketing, digital advertising, etc. Detail your specific tactics, like content creation, participation in events, collaboration with influencers, etc. It's also helpful to explain how you will measure and evaluate the success of your marketing efforts.",
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

export interface ButtonConfig {
    id: number;
    label: string;
    action?: (setModalOpen?: (modalType: string) => void, project?: any) => void;

    link?: (id: number) => string;
    classNameType: string;
}

interface StateConfig {
    label: string;
    buttons: ButtonConfig[];
    milestone_status_id?: number;
    protocol_team?: boolean;
}

export const buttonTypes: ButtonConfig[] = [
    {
        id: 1,
        label: 'View Campaign',
        action: () => {},
        link: (id: number) => `/campaign/${id}`,
        classNameType: 'outline-card',
    },
    {
        id: 2,
        label: 'Send to Revision',
        action: () => alert('Api enviando la campaña a revision'),
        classNameType: 'fill',
    },
    {
        id: 3,
        label: 'View Report',
        action: (setModalOpen) => {
            if (setModalOpen) setModalOpen('viewReport');
        },
        classNameType: 'fill',
    },
    {
        id: 4,
        label: "Your campaign is accepted, let's launch it",
        action: () => console.log('llamado a la api para lanzar la campaña'),
        classNameType: 'outline-card',
    },
    {
        id: 5,
        label: 'Launch Campaign',
        action: (setModalOpen) => {
            if (setModalOpen) setModalOpen('launchCampaign');
        },
        classNameType: 'fill',
    },
    {
        id: 6,
        label: 'Manage Campaign',
        action: (setModalOpen) => {
            if (setModalOpen) setModalOpen('manageCampaign');
        },
        classNameType: 'fill',
    },
    {
        id: 7,
        label: 'Edit Campaign',
        action: () => {},
        link: (id: number) => `/campaign/edit?id=${id}`,
        classNameType: 'fill',
    },
    {
        id: 8,
        label: 'Create Contract', //7
        action: (setModalOpen) => {
            if (setModalOpen) setModalOpen('createSmartContract');
        },
        classNameType: 'fill',
    },
    {
        id: 9,
        label: 'Publish Contract', //7
        action: (setModalOpen) => {
            if (setModalOpen) setModalOpen('publishSmartContract');
        },
        classNameType: 'fill',
    },
    {
        id: 10,
        label: 'Initialize Campaign',
        action: (setModalOpen) => {
            if (setModalOpen) setModalOpen('initializeCampaign');
        },
        classNameType: 'fill',
    },
    {
        id: 11,
        label: 'Launch Campaign',
        action: (setModalOpen) => {
            if (setModalOpen) setModalOpen('launchCampaign');
        },

        classNameType: 'fill',
    },
    {
        id: 12,
        label: 'Validate Fundraising Status (TX)',
        action: (setModalOpen) => {
            if (setModalOpen) setModalOpen('validateFundraisingStatus');
        },
        classNameType: 'fill',
    },
    {
        id: 13,
        label: 'Contact Team Support',
        action: (setModalOpen) => {
            if (setModalOpen) setModalOpen('contactSupport');
        },
        classNameType: 'fill',
    },
    {
        id: 14,
        label: 'Invest',
        action: (project) => {
            localStorage.setItem('project', JSON.stringify(project));
        },
        link: (id: number) => '/invest',
        classNameType: 'invest',
    },
    {
        id: 15,
        label: 'Withdraw Tokens',
        action: (setModalOpen) => {
            if (setModalOpen) setModalOpen('withdrawTokens');
        },
        classNameType: 'fillb',
    },
];
export const ButtonsForCampaignPage = (state_id: number, isProtocolTeam: boolean, isAdmin: boolean): StateConfig => {
    const state: { [key: number]: StateConfig } = {
        1: {
            label: 'Draft', // Created
            buttons: [
                buttonTypes[1], // Send to Revision
            ],
        },
        2: {
            label: 'Submitted', // Submitted
            buttons: [
                buttonTypes[12], // Contact Support Team
            ],
        },
        3: {
            label: 'Rejected', // Rejected
            buttons: [
                buttonTypes[3], // View Report
            ],
        },
        4: {
            label: 'Approved', // Approved
            buttons: [
                buttonTypes[4], // Launch Campaign
            ],
        },
        5: {
            label: 'Created', // Contract Created
            buttons: [
                buttonTypes[12], // Contact Support Team
            ],
        },
        6: {
            label: 'Deploy', // Contract Published
            buttons: [
                buttonTypes[12], // Contact Support Team
            ],
        },
        7: {
            label: 'Ready', // Contract Started
            buttons: [
                buttonTypes[4], // Contact Support Team
            ],
        },
        8: {
            label: 'Countdown', // Countdown
            buttons: [
                buttonTypes[12], // Contact Support Team
            ],
        },
        9: {
            label: 'Fundraising',
            buttons: isAdmin
                ? [buttonTypes[12]] // Contact Support Team
                : isProtocolTeam
                ? [buttonTypes[12]] // Protocol Team Button
                : [buttonTypes[13]], // Default Button
        },
    };
    return state[state_id] || { label: 'Not Started', buttons: [] };
};

export const CardInformationByState = (state_id: number, milestone_status_id?: number, isAdmin?: boolean): StateConfig => {
    const { setMenuView } = useProjectDetailStore();

    const state: { [key: number]: StateConfig } = {
        1: {
            label: 'Draft', // Created
            buttons: [
                {
                    id: 1,
                    label: 'View Campaign',
                    action: () => {},
                    link: (id: number) => `/campaign/${id}`,
                    classNameType: 'outline-card',
                },
                buttonTypes[1], // Publish
            ],
        },
        2: {
            label: 'Submitted', // Submitted
            buttons: [
                buttonTypes[0], // View Campaign
            ],
        },
        3: {
            label: 'Rejected', // Rejected
            buttons: [
                buttonTypes[2], // View report
            ],
        },
        4: {
            label: 'Approved', // Approved
            buttons: [
                buttonTypes[0], // View Campaign
            ],
        },
        5: {
            label: 'Created', // Contract Created
            buttons: [
                buttonTypes[0], // View Campaign
            ],
        },
        6: {
            label: 'Deploy', // Contract Published
            buttons: [
                buttonTypes[0], // View Campaign
            ],
        },
        7: {
            label: 'Ready', // Contract Started
            buttons: [
                buttonTypes[0], // View Campaign
                buttonTypes[4], // Launch Campaign (tx)
            ],
        },
        8: {
            label: 'Countdown', // Countdown
            buttons: [
                buttonTypes[0], // View Campaign
            ],
        },
        9: {
            label: 'Fundraising', // Fundraising
            buttons: [
                buttonTypes[0], // View Campaign
            ],
        },
        10: {
            label: 'Finishing',
            buttons: [
                buttonTypes[11], // Validate Fundraising Status (TX)
            ],
        },
        11: isAdmin ? (milestone_status_id ? ButtonsByMilestoneStatus(milestone_status_id) : { label: 'Active', buttons: [] }) : { label: 'Active', buttons: [] },
        12: {
            label: 'Failed',
            buttons: [buttonTypes[14]],
        },
        13: {
            label: 'Unreached',
            buttons: [buttonTypes[14]],
        },
        14: {
            label: 'Succesfull',
            buttons: [
                buttonTypes[0], // View Campaign
            ],
        },
    };

    return state[state_id] || { label: 'Not Started', buttons: [] };
};

export const cardInformationForProtocolTeam = (state_id: number): StateConfig => {
    const state: { [key: number]: StateConfig } = {
        2: {
            label: 'Attempmt to Launch', // Submitted
            buttons: [
                buttonTypes[0], // View Campaign
                buttonTypes[5], // Manage Campaign
            ],
        },
        3: {
            label: 'Rejected', // Rejected
            buttons: [
                buttonTypes[0], // View report
                buttonTypes[6], // Edit Campaign
            ],
        },
        4: {
            label: 'Approved', // Approved
            buttons: [
                buttonTypes[0], // View Campaign
                buttonTypes[7], // Create Contract
            ],
        },
        5: {
            label: 'Created', // Contract Created
            buttons: [
                buttonTypes[0], // View Campaign
                buttonTypes[8], // Publish Contract
            ],
        },
        6: {
            label: 'Deploy', // Contract Published
            buttons: [
                buttonTypes[0], // View Campaign
                buttonTypes[9], // Initialize Campaign + modal
            ],
        },
        7: {
            label: 'Ready', // Contract Started
            buttons: [
                buttonTypes[0], // View Campaign
                buttonTypes[10], // Launch Campaign
            ],
        },
        8: {
            label: 'Countdown', // Countdown
            buttons: [
                buttonTypes[0], // View Campaign
            ],
        },
        9: {
            label: 'Fundraising', // Fundraising
            buttons: [
                buttonTypes[0], // View Campaign
            ],
        },
        10: {
            label: 'Finishing',
            buttons: [
                buttonTypes[11], // Validate Fundraising Status (TX)
            ],
        },
    };

    return state[state_id] || { label: 'Not Started', buttons: [] };
};

export const ButtonsByMilestoneStatus = (milestone_status_id: number): StateConfig => {
    const { setMenuView } = useProjectDetailStore();
    const state: { [key: number]: StateConfig } = {
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
                        setMenuView('Roadmap & Milestones');
                    },
                    link: (id: number) => `/campaign/${id}`,
                    classNameType: 'fill',
                },
            ],
        },
        4: {
            label: 'Rejected',
            buttons: [
                buttonTypes[0],
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
                buttonTypes[0],

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
