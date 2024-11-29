import { Category } from '@/types/ConstantTypes';

import { DISCORD, FACEBOOK, INSTAGRAM, LOGO_FULL_LIGHT, XS, WEBSITE, LINKEDIN } from '@/utils/images';

export const categories: Category[] = ['Technology', 'Event', 'Education', 'Gaming', 'Social', 'Food'];

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
export const stylesByStatus = (status: string, styles: { [key: string]: string }) => {
    const statusStyles: { [key: string]: string } = {
        'Not Started': styles.notStarted,
        Started: styles.started,
        Submited: styles.submited,
        Rejected: styles.rejected,
        Finished: styles.finished,
        Failed: styles.failed,
    };

    return statusStyles[status] || styles.pending;
};

export const imageByStatus = (status: string) => {
    const statusImages: { [key: string]: string } = {
        'Not Started': '/img/icons/status/yellow.svg',
        Started: '/img/icons/status/green.svg',
        Submited: '/img/icons/status/yellow.svg',
        Rejected: '/img/icons/status/red.svg',
        Finished: '/img/icons/status/green.svg',
        Failed: '/img/icons/status/red.svg',
    };
    return statusImages[status] || '/img/icons/status/yellow.svg';
};

export const statedById = (id: number) => {
    const status: { [key: number]: string } = {
        1: 'Created',
        2: 'Submitted',
        3: 'Rejected',
        4: 'Approved',
        5: 'Contract Created',
        6: 'Contract Published',
        7: 'Contract Started',
        8: 'Countdown',
        9: 'Fundraising',
        10: 'Finishing',
        11: 'Active',
        12: 'Failed',
        13: 'Unreached',
        14: 'Success',
    };
    return status[id] || 'Not Started';
};

interface ButtonConfig {
    label: string;
    action: () => void;
    link?: (id: number) => string;
}

interface StateConfig {
    label: string;
    buttons: ButtonConfig[];
}

export const buttonTypes = [
    { label: 'View Campaign', action: () => {}, link: (id: number) => `/campaign/${id}` },
    { label: 'Send to Revision', action: () => console.log('Api enviando la campaña a revision') },
    { label: 'View Report', action: () => {}, link: (id: number) => `/campaign/${id}/report` },
    { label: "Your campaign is accepted, let's launch it", action: () => console.log('llamado a la api para lanzar la campaña') },
    { label: 'Launch Campaign (TX)', action: () => console.log('llamado a la api, involucra blockchain') },
];

export const cardInformationByState = (state_id: number): StateConfig => {
    const state: { [key: number]: StateConfig } = {
        1: {
            label: 'Draft', //Created
            buttons: [
                buttonTypes[0], // View Campaign
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
                buttonTypes[3], // Api Call
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
    };

    return state[state_id] || { label: 'Not Started', buttons: [] };
};
