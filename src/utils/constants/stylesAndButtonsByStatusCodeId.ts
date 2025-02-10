import { CampaignTab, ROUTES } from './routes';
import { CampaignStatus_Code_Id, MilestoneStatus_Code_Id } from './status';

export interface ButtonType {
    label: string;
    action?: (setModalOpen?: (modalType: string) => void, project?: any) => void;
    link?: (id: string) => string;
    classNameType: string;
}

export interface CampaignStatusConfig {
    label: string;
    labelClass: string;
    buttonsForCards: ButtonType[];
    buttonsForHeader: ButtonType[];
    buttonsForDetails: ButtonType[];
}

//--------------------------------------------------------------

export const StylesByCampaignStatus_Code_Id = (code_id: number, styles: { [key: string]: string; }): string => {
    const statusStyles: Record<CampaignStatus_Code_Id, string> = {
        [CampaignStatus_Code_Id.NOT_STARTED]: styles.notStarted,
        [CampaignStatus_Code_Id.CREATED]: styles.created,
        [CampaignStatus_Code_Id.SUBMITTED]: styles.submitted,
        [CampaignStatus_Code_Id.REJECTED]: styles.rejected,
        [CampaignStatus_Code_Id.APPROVED]: styles.approved,
        [CampaignStatus_Code_Id.CONTRACT_CREATED]: styles.contractCreated,
        [CampaignStatus_Code_Id.CONTRACT_PUBLISHED]: styles.contractPublished,
        [CampaignStatus_Code_Id.CONTRACT_STARTED]: styles.contractStarted,
        [CampaignStatus_Code_Id.COUNTDOWN]: styles.countdown,
        [CampaignStatus_Code_Id.FUNDRAISING]: styles.fundraising,
        [CampaignStatus_Code_Id.FINISHING]: styles.finishing,
        [CampaignStatus_Code_Id.ACTIVE]: styles.active,
        [CampaignStatus_Code_Id.FAILED]: styles.failed,
        [CampaignStatus_Code_Id.UNREACHED]: styles.unreached,
        [CampaignStatus_Code_Id.SUCCESS]: styles.success,
    };

    if (statusStyles[code_id as CampaignStatus_Code_Id] === undefined) {
        throw new Error(`No style found for code_id: ${code_id}`);
    }

    return statusStyles[code_id as CampaignStatus_Code_Id];
};

// export const ImageByCampaignStatus_Code_Id = (code_id: string): string => {
//     const statusImages: Record<CampaignStatus_Code_Id, string> = {
//         [CampaignStatus_Code_Id.NOT_STARTED]: '/img/icons/status/yellow.svg',
//         [CampaignStatus_Code_Id.CREATED]: '/img/icons/status/blue.svg',
//         [CampaignStatus_Code_Id.SUBMITTED]: '/img/icons/status/yellow.svg',
//         [CampaignStatus_Code_Id.REJECTED]: '/img/icons/status/red.svg',
//         [CampaignStatus_Code_Id.APPROVED]: '/img/icons/status/blue.svg',
//         [CampaignStatus_Code_Id.CONTRACT_CREATED]: '/img/icons/status/purple.svg',
//         [CampaignStatus_Code_Id.CONTRACT_PUBLISHED]: '/img/icons/status/purple.svg',
//         [CampaignStatus_Code_Id.CONTRACT_STARTED]: '/img/icons/status/purple.svg',
//         [CampaignStatus_Code_Id.COUNTDOWN]: '/img/icons/status/orange.svg',
//         [CampaignStatus_Code_Id.FUNDRAISING]: '/img/icons/status/green.svg',
//         [CampaignStatus_Code_Id.FINISHING]: '/img/icons/status/green.svg',
//         [CampaignStatus_Code_Id.ACTIVE]: '/img/icons/status/green.svg',
//         [CampaignStatus_Code_Id.FAILED]: '/img/icons/status/red.svg',
//         [CampaignStatus_Code_Id.UNREACHED]: '/img/icons/status/red.svg',
//         [CampaignStatus_Code_Id.SUCCESS]: '/img/icons/status/gold.svg',
//     };

//     if (statusImages[code_id as CampaignStatus_Code_Id] === undefined) {
//         throw new Error(`No image found for code_id: ${code_id}`);
//     }

//     return statusImages[code_id as CampaignStatus_Code_Id];
// };

export const StylesByMilestoneStatus_Code_Id = (code_id: number, styles: { [key: string]: string; }): string => {
    const statusStyles: Record<MilestoneStatus_Code_Id, string> = {
        [MilestoneStatus_Code_Id.NOT_STARTED]: styles.notStarted,
        [MilestoneStatus_Code_Id.STARTED]: styles.created,
        [MilestoneStatus_Code_Id.SUBMITTED]: styles.submitted,
        [MilestoneStatus_Code_Id.REJECTED]: styles.rejected,
        [MilestoneStatus_Code_Id.COLLECT]: styles.approved,
        [MilestoneStatus_Code_Id.FINISHED]: styles.success,
        [MilestoneStatus_Code_Id.FAILED]: styles.failed,
    };

    if (statusStyles[code_id as MilestoneStatus_Code_Id] === undefined) {
        throw new Error(`No style found for code_id: ${code_id}`);
    }

    return statusStyles[code_id as MilestoneStatus_Code_Id];
};


export const ImageByMilestoneStatus_Code_Id = (code_id: number): string => {
    const statusImages: Record<MilestoneStatus_Code_Id, string> = {
        [MilestoneStatus_Code_Id.NOT_STARTED]: '/img/icons/status/yellow.svg',
        [MilestoneStatus_Code_Id.STARTED]: '/img/icons/status/yellow.svg',
        [MilestoneStatus_Code_Id.SUBMITTED]: '/img/icons/status/yellow.svg',
        [MilestoneStatus_Code_Id.REJECTED]: '/img/icons/status/red.svg',
        [MilestoneStatus_Code_Id.COLLECT]: '/img/icons/status/green.svg',
        [MilestoneStatus_Code_Id.FINISHED]: '/img/icons/status/green.svg',
        [MilestoneStatus_Code_Id.FAILED]: '/img/icons/status/red.svg',
    };

    if (statusImages[code_id as MilestoneStatus_Code_Id] === undefined) {
        throw new Error(`No image found for code_id: ${code_id}`);
    }

    return statusImages[code_id as MilestoneStatus_Code_Id];
};

//--------------------------------------------------------------

export const ButtonTypes: { [key: string]: ButtonType } = {
    VIEW_CAMPAIGN: {
        label: 'View Campaign',
        action: () => {},
        link: (id: string) => `${ROUTES.campaignDetails(id)}`,
        classNameType: 'outline-card center',
    },
    VIEW_CAMPAIGN_BLACK: {
        label: 'View Campaign',
        action: () => {},
        link: (id: string) => `${ROUTES.campaignDetails(id)}`,
        classNameType: 'fill center',
    },
    LEARN_MORE: {
        label: 'Learn More',
        action: () => {},
        link: (id: string) => `${ROUTES.campaignDetails(id)}`,
        classNameType: 'fill center',
    },
    EDIT_CAMPAIGN: {
        label: 'Edit Campaign',
        action: () => {},
        link: (id: string) => `${ROUTES.campaignEdit(id)}`,
        classNameType: 'fill center',
    },
    INVEST: {
        label: 'Invest',
        action: () => {},
        link: (id: string) => `${ROUTES.campaignInvest(id)}`,
        classNameType: 'invest center',
    },
    VIEW_MILESTONES: {
        label: 'View Milestones',
        action: () => {},
        link: (id: string) => `${ROUTES.campaignTab(id, CampaignTab.ROADMAP)}`,
        classNameType: 'outline-card center',
    },
    VIEW_ROADMAP: {
        label: 'View Roadmap',
        action: () => {},
        link: (id: string) => `${ROUTES.campaignTab(id, CampaignTab.ROADMAP)}`,
        classNameType: 'outline-card center',
    },
    VIEW_MEMBERS: {
        label: 'View Members',
        action: () => {},
        link: (id: string) => `${ROUTES.campaignTab(id, CampaignTab.MEMBERS)}`,
        classNameType: 'outline-card center',
    },
    VIEW_QA: {
        label: 'View Q & A',
        action: () => {},
        link: (id: string) => `${ROUTES.campaignTab(id, CampaignTab.QA)}`,
        classNameType: 'outline-card center',
    },
    VIEW_TOKENOMICS: {
        label: 'View Tokenomics',
        action: () => {},
        link: (id: string) => `${ROUTES.campaignTab(id, CampaignTab.TOKENOMICS)}`,
        classNameType: 'outline-card center',
    },
    SEND_TO_REVISION: {
        label: 'Send to Revision',
        action: () => alert('Api enviando la campaña a revision'),
        classNameType: 'fill center',
    },
    VIEW_REPORT: {
        label: 'View Report',
        action: (setModalOpen) => {
            if (setModalOpen) setModalOpen('viewReport');
        },
        classNameType: 'outline-card center',
    },
    PRE_LAUNCH: {
        label: "Your campaign is accepted, let's launch it",
        action: () => alert('Api enviando la campaña a lanzar'),
        classNameType: 'outline-card center',
    },
    LAUNCH_CAMPAIGN: {
        label: 'Launch Campaign',
        action: (setModalOpen) => {
            if (setModalOpen) setModalOpen('launchCampaign');
        },
        classNameType: 'fill center center',
    },
    MANAGE_CAMPAIGN: {
        label: 'Manage Campaign',
        action: (setModalOpen) => {
            if (setModalOpen) setModalOpen('manageCampaign');
        },
        classNameType: 'fill center',
    },
    CREATE_CONTRACT: {
        label: 'Create Contract',
        action: (setModalOpen) => {
            if (setModalOpen) setModalOpen('createSmartContract');
        },
        classNameType: 'fill center',
    },
    PUBLISH_CONTRACT: {
        label: 'Publish Contract',
        action: (setModalOpen) => {
            if (setModalOpen) setModalOpen('publishSmartContract');
        },
        classNameType: 'fill center',
    },
    INITIALIZE_CAMPAIGN: {
        label: 'Initialize Campaign',
        action: (setModalOpen) => {
            if (setModalOpen) setModalOpen('initializeCampaign');
        },
        classNameType: 'fill center',
    },
    VALIDATE_FUNDRAISING_STATUS: {
        label: 'Validate Fundraising Status',
        action: (setModalOpen) => {
            if (setModalOpen) setModalOpen('validateFundraisingStatus');
        },
        classNameType: 'outline-card center',
    },
    SEND_MILESTONE_REPORT: {
        label: 'Send Report',
        action: (setModalOpen) => {
            if (setModalOpen) setModalOpen('sendReport');
        },
        classNameType: 'fill center',
    },
    VIEW_MILESTONE_REPORT: {
        label: 'View Report',
        action: () => alert('Not implemented'),
        classNameType: 'fill center',
    },
    COLLECT_MILESTONE: {
        label: 'Collect Founds',
        action: (setModalOpen) => {
            if (setModalOpen) setModalOpen('collect');
        },
        classNameType: 'fill center',
    },
    CONTACT_TEAM_SUPPORT: {
        label: 'Contact Team Support',
        action: (setModalOpen) => {
            if (setModalOpen) setModalOpen('contactSupport');
        },
        classNameType: 'fill center',
    },
    GETBACK_FAILED: {
        label: 'Get Back',
        action: (setModalOpen) => {
            if (setModalOpen) setModalOpen('withdrawTokens');
        },
        classNameType: 'failed center',
    },
    GETBACK_UNREACHED: {
        label: 'Get Back',
        action: (setModalOpen) => {
            if (setModalOpen) setModalOpen('withdrawTokens');
        },
        classNameType: 'unreached center',
    },
    WITHDRAW_FAILED: {
        label: 'Withdraw',
        action: (setModalOpen) => {
            if (setModalOpen) setModalOpen('withdrawTokens');
        },
        classNameType: 'failed center',
    },
    WITHDRAW_UNREACHED: {
        label: 'Withdraw',
        action: (setModalOpen) => {
            if (setModalOpen) setModalOpen('withdrawTokens');
        },
        classNameType: 'unreached center',
    },
};

export const cardInformationForProtocolTeam = (code_id: number, totalMilestones: number, currentMilestoneIndex?: number, milestone_status_code_id?: number): CampaignStatusConfig => {
    switch (code_id) {
        case CampaignStatus_Code_Id.NOT_STARTED:
            return {
                label: 'Draft',
                labelClass: 'draft',
                buttonsForCards: [ButtonTypes.VIEW_CAMPAIGN],
                buttonsForHeader: [],
                buttonsForDetails: [],
            };

        case CampaignStatus_Code_Id.CREATED:
            return {
                label: 'Draft',
                labelClass: 'draft',
                buttonsForCards: [ButtonTypes.VIEW_CAMPAIGN, ButtonTypes.EDIT_CAMPAIGN],
                buttonsForHeader: [ButtonTypes.EDIT_CAMPAIGN],
                buttonsForDetails: [],
            };

        case CampaignStatus_Code_Id.SUBMITTED:
            return {
                label: 'Attempt to Launch',
                labelClass: 'attempt-to-launch',
                buttonsForCards: [ButtonTypes.VIEW_CAMPAIGN, ButtonTypes.MANAGE_CAMPAIGN],
                buttonsForHeader: [ButtonTypes.MANAGE_CAMPAIGN],
                buttonsForDetails: [],
            };

        case CampaignStatus_Code_Id.REJECTED:
            return {
                label: 'Rejected',
                labelClass: 'rejected',
                buttonsForCards: [ButtonTypes.VIEW_CAMPAIGN, ButtonTypes.EDIT_CAMPAIGN],
                buttonsForHeader: [ButtonTypes.EDIT_CAMPAIGN],
                buttonsForDetails: [],
            };

        case CampaignStatus_Code_Id.APPROVED:
            return {
                label: 'Approved',
                labelClass: 'approved',
                buttonsForCards: [ButtonTypes.VIEW_CAMPAIGN, ButtonTypes.CREATE_CONTRACT],
                buttonsForHeader: [ButtonTypes.CREATE_CONTRACT],
                buttonsForDetails: [],
            };

        case CampaignStatus_Code_Id.CONTRACT_CREATED:
            return {
                label: 'Created',
                labelClass: 'created',
                buttonsForCards: [ButtonTypes.VIEW_CAMPAIGN, ButtonTypes.PUBLISH_CONTRACT],
                buttonsForHeader: [ButtonTypes.PUBLISH_CONTRACT],
                buttonsForDetails: [],
            };

        case CampaignStatus_Code_Id.CONTRACT_PUBLISHED:
            return {
                label: 'Deploy',
                labelClass: 'deploy',
                buttonsForCards: [ButtonTypes.VIEW_CAMPAIGN, ButtonTypes.INITIALIZE_CAMPAIGN],
                buttonsForHeader: [ ButtonTypes.INITIALIZE_CAMPAIGN],
                buttonsForDetails: [],
            };

        case CampaignStatus_Code_Id.CONTRACT_STARTED:
            return {
                label: 'Ready',
                labelClass: 'ready',
                buttonsForCards: [ButtonTypes.VIEW_CAMPAIGN, ButtonTypes.LAUNCH_CAMPAIGN],
                buttonsForHeader: [ButtonTypes.LAUNCH_CAMPAIGN],
                buttonsForDetails: [],
            };

        case CampaignStatus_Code_Id.COUNTDOWN:
            return {
                label: 'Countdown',
                labelClass: 'countdown',
                buttonsForCards: [ButtonTypes.VIEW_CAMPAIGN_BLACK],
                buttonsForHeader: [],
                buttonsForDetails: [],
            };

        case CampaignStatus_Code_Id.FUNDRAISING:
            return {
                label: 'Fundraising',
                labelClass: 'fundraising',
                buttonsForCards: [ButtonTypes.VIEW_CAMPAIGN_BLACK],
                buttonsForHeader: [],
                buttonsForDetails: [],
            };

        case CampaignStatus_Code_Id.FINISHING:
            return {
                label: 'Finishing',
                labelClass: 'finishing',
                buttonsForCards: [ButtonTypes.VALIDATE_FUNDRAISING_STATUS],
                buttonsForHeader: [ButtonTypes.VALIDATE_FUNDRAISING_STATUS],
                buttonsForDetails: [],
            };

        case CampaignStatus_Code_Id.ACTIVE:
            if (totalMilestones === 0 || currentMilestoneIndex === undefined || milestone_status_code_id === undefined) {
                throw new Error('Milestone status code_id is required');
            }
            return CardInformationForProtocolTeamByMilestone(totalMilestones, currentMilestoneIndex, milestone_status_code_id);

        case CampaignStatus_Code_Id.FAILED:
            return {
                label: 'Failed',
                labelClass: 'failed',
                buttonsForCards: [ButtonTypes.VIEW_CAMPAIGN, ButtonTypes.WITHDRAW_FAILED],
                buttonsForHeader: [ButtonTypes.WITHDRAW_FAILED],
                buttonsForDetails: [],
            };

        case CampaignStatus_Code_Id.UNREACHED:
            return {
                label: 'Unreached',
                labelClass: 'unreached',
                buttonsForCards: [ButtonTypes.VIEW_CAMPAIGN, ButtonTypes.WITHDRAW_UNREACHED],
                buttonsForHeader: [ ButtonTypes.WITHDRAW_UNREACHED],
                buttonsForDetails: [],
            };

        case CampaignStatus_Code_Id.SUCCESS:
            return {
                label: 'Success',
                labelClass: 'success',
                buttonsForCards: [ButtonTypes.VIEW_CAMPAIGN_BLACK],
                buttonsForHeader: [],
                buttonsForDetails: [],
            };

        default:
            throw new Error(`No Info found for code_id: ${code_id}`);
    }
};

export const CardInformationForManagers = (code_id: number, totalMilestones: number, currentMilestoneIndex?: number, milestone_status_code_id?: number): CampaignStatusConfig => {
    switch (code_id) {
        case CampaignStatus_Code_Id.NOT_STARTED:
            return {
                label: 'Draft',
                labelClass: 'draft',
                buttonsForCards: [ButtonTypes.VIEW_CAMPAIGN],
                buttonsForHeader: [],
                buttonsForDetails: [],
            };

        case CampaignStatus_Code_Id.CREATED:
            return {
                label: 'Draft',
                labelClass: 'draft',
                buttonsForCards: [ButtonTypes.VIEW_CAMPAIGN, ButtonTypes.SEND_TO_REVISION],
                buttonsForHeader: [ButtonTypes.SEND_TO_REVISION],
                buttonsForDetails: [],
            };

        case CampaignStatus_Code_Id.SUBMITTED:
            return {
                label: 'Submitted',
                labelClass: 'submitted',
                buttonsForCards: [ButtonTypes.CONTACT_TEAM_SUPPORT],
                buttonsForHeader: [ButtonTypes.CONTACT_TEAM_SUPPORT],
                buttonsForDetails: [],
            };

        case CampaignStatus_Code_Id.REJECTED:
            return {
                label: 'Rejected',
                labelClass: 'rejected',
                buttonsForCards: [ButtonTypes.VIEW_REPORT],
                buttonsForHeader: [ ButtonTypes.VIEW_REPORT],
                buttonsForDetails: [],
            };

        case CampaignStatus_Code_Id.APPROVED:
            return {
                label: 'Approved',
                labelClass: 'approved',
                buttonsForCards: [ButtonTypes.PRE_LAUNCH],
                buttonsForHeader: [ButtonTypes.PRE_LAUNCH],
                buttonsForDetails: [],
            };

        case CampaignStatus_Code_Id.CONTRACT_CREATED:
            return {
                label: 'Created',
                labelClass: 'created',
                buttonsForCards: [ButtonTypes.VIEW_CAMPAIGN],
                buttonsForHeader: [ButtonTypes.CONTACT_TEAM_SUPPORT],
                buttonsForDetails: [],
            };

        case CampaignStatus_Code_Id.CONTRACT_PUBLISHED:
            return {
                label: 'Deploy',
                labelClass: 'deploy',
                buttonsForCards: [ButtonTypes.VIEW_CAMPAIGN],
                buttonsForHeader: [ButtonTypes.CONTACT_TEAM_SUPPORT],
                buttonsForDetails: [],
            };

        case CampaignStatus_Code_Id.CONTRACT_STARTED:
            return {
                label: 'Ready',
                labelClass: 'ready',
                buttonsForCards: [ButtonTypes.VIEW_CAMPAIGN, ButtonTypes.LAUNCH_CAMPAIGN],
                buttonsForHeader: [ButtonTypes.LAUNCH_CAMPAIGN],
                buttonsForDetails: [],
            };

        case CampaignStatus_Code_Id.COUNTDOWN:
            return {
                label: 'Countdown',
                labelClass: 'countdown',
                buttonsForCards: [ButtonTypes.VIEW_CAMPAIGN_BLACK],
                buttonsForHeader: [ButtonTypes.CONTACT_TEAM_SUPPORT],
                buttonsForDetails: [],
            };

        case CampaignStatus_Code_Id.FUNDRAISING:
            return {
                label: 'Fundraising',
                labelClass: 'fundraising',
                buttonsForCards: [ButtonTypes.VIEW_CAMPAIGN_BLACK],
                buttonsForHeader: [ButtonTypes.CONTACT_TEAM_SUPPORT],
                buttonsForDetails: [],
            };

        case CampaignStatus_Code_Id.FINISHING:
            return {
                label: 'Finishing',
                labelClass: 'finishing',
                buttonsForCards: [ButtonTypes.VALIDATE_FUNDRAISING_STATUS],
                buttonsForHeader: [ButtonTypes.VALIDATE_FUNDRAISING_STATUS],
                buttonsForDetails: [],
            };

        case CampaignStatus_Code_Id.ACTIVE:
            if (totalMilestones === 0 || currentMilestoneIndex === undefined || milestone_status_code_id === undefined) {
                throw new Error('Milestone status code_id is required');
            }
            return CardInformationForManagersByMilestone(totalMilestones, currentMilestoneIndex, milestone_status_code_id);

        case CampaignStatus_Code_Id.FAILED:
            return {
                label: 'Failed',
                labelClass: 'failed',
                buttonsForCards: [ButtonTypes.VIEW_CAMPAIGN, ButtonTypes.WITHDRAW_FAILED],
                buttonsForHeader: [ButtonTypes.WITHDRAW_FAILED],
                buttonsForDetails: [],
            };

        case CampaignStatus_Code_Id.UNREACHED:
            return {
                label: 'Unreached',
                labelClass: 'unreached',
                buttonsForCards: [ButtonTypes.VIEW_CAMPAIGN, ButtonTypes.WITHDRAW_UNREACHED],
                buttonsForHeader: [ButtonTypes.WITHDRAW_UNREACHED],
                buttonsForDetails: [],
            };

        case CampaignStatus_Code_Id.SUCCESS:
            return {
                label: 'Success',
                labelClass: 'success',
                buttonsForCards: [ButtonTypes.VIEW_CAMPAIGN_BLACK],
                buttonsForHeader: [],
                buttonsForDetails: [],
            };

        default:
            throw new Error(`No Info found for code_id: ${code_id}`);
    }
};

export const CardInformationForInvestors = (code_id: number, totalMilestones: number, currentMilestoneIndex?: number, milestone_status_code_id?: number): CampaignStatusConfig => {
    switch (code_id) {
        case CampaignStatus_Code_Id.NOT_STARTED:
            return {
                label: 'Draft',
                labelClass: 'draft',
                buttonsForCards: [],
                buttonsForHeader: [],
                buttonsForDetails: [],
            };

        case CampaignStatus_Code_Id.CREATED:
            return {
                label: 'Draft',
                labelClass: 'draft',
                buttonsForCards: [],
                buttonsForHeader: [],
                buttonsForDetails: [],
            };

        case CampaignStatus_Code_Id.SUBMITTED:
            return {
                label: 'Submitted',
                labelClass: 'submitted',
                buttonsForCards: [],
                buttonsForHeader: [],
                buttonsForDetails: [],
            };

        case CampaignStatus_Code_Id.REJECTED:
            return {
                label: 'Rejected',
                labelClass: 'rejected',
                buttonsForCards: [],
                buttonsForHeader: [],
                buttonsForDetails: [],
            };

        case CampaignStatus_Code_Id.APPROVED:
            return {
                label: 'Approved',
                labelClass: 'approved',
                buttonsForCards: [],
                buttonsForHeader: [],
                buttonsForDetails: [],
            };

        case CampaignStatus_Code_Id.CONTRACT_CREATED:
            return {
                label: 'Created',
                labelClass: 'created',
                buttonsForCards: [],
                buttonsForHeader: [],
                buttonsForDetails: [],
            };

        case CampaignStatus_Code_Id.CONTRACT_PUBLISHED:
            return {
                label: 'Ready',
                labelClass: 'ready',
                buttonsForCards: [],
                buttonsForHeader: [],
                buttonsForDetails: [],
            };

        case CampaignStatus_Code_Id.CONTRACT_STARTED:
            return {
                label: 'Ready',
                labelClass: 'ready',
                buttonsForCards: [],
                buttonsForHeader: [],
                buttonsForDetails: [],
            };

        case CampaignStatus_Code_Id.COUNTDOWN:
            return {
                label: 'Countdown',
                labelClass: 'countdown',
                buttonsForCards: [ButtonTypes.VIEW_MILESTONES, ButtonTypes.LEARN_MORE],
                buttonsForHeader: [ButtonTypes.CONTACT_TEAM_SUPPORT],
                buttonsForDetails: [],
            };

        case CampaignStatus_Code_Id.FUNDRAISING:
            return {
                label: 'Fundraising',
                labelClass: 'fundraising',
                buttonsForCards: [ButtonTypes.INVEST, ButtonTypes.LEARN_MORE],
                buttonsForHeader: [ButtonTypes.INVEST],
                buttonsForDetails: [],
            };

        case CampaignStatus_Code_Id.ACTIVE:
            if (totalMilestones === 0 || currentMilestoneIndex === undefined || milestone_status_code_id === undefined) {
                throw new Error('Milestone status code_id is required');
            }
            return {
                label: `Active ${currentMilestoneIndex + 1}/${totalMilestones}`,
                labelClass: 'active',
                buttonsForCards: [ButtonTypes.VIEW_ROADMAP, ButtonTypes.LEARN_MORE],
                buttonsForHeader: [ButtonTypes.CONTACT_TEAM_SUPPORT],
                buttonsForDetails: [],
            };
        case CampaignStatus_Code_Id.FINISHING:
            return {
                label: 'Finishing',
                labelClass: 'finishing',
                buttonsForCards: [ButtonTypes.LEARN_MORE],
                buttonsForHeader: [ButtonTypes.CONTACT_TEAM_SUPPORT],
                buttonsForDetails: [],
            };

        case CampaignStatus_Code_Id.FAILED:
            return {
                label: 'Failed',
                labelClass: 'failed',
                buttonsForCards: [ButtonTypes.LEARN_MORE, ButtonTypes.GETBACK_FAILED],
                buttonsForHeader: [ButtonTypes.GETBACK_FAILED],
                buttonsForDetails: [],
            };

        case CampaignStatus_Code_Id.UNREACHED:
            return {
                label: 'Unreached',
                labelClass: 'unreached',
                buttonsForCards: [ButtonTypes.LEARN_MORE, ButtonTypes.GETBACK_UNREACHED],
                buttonsForHeader: [ButtonTypes.GETBACK_UNREACHED],
                buttonsForDetails: [],
            };

        case CampaignStatus_Code_Id.SUCCESS:
            return {
                label: 'Success',
                labelClass: 'success',
                buttonsForCards: [ButtonTypes.LEARN_MORE],
                buttonsForHeader: [ButtonTypes.CONTACT_TEAM_SUPPORT],
                buttonsForDetails: [],
            };

        default:
            throw new Error(`No Info found for code_id: ${code_id}`);
    }
};

export const CardInformationForProtocolTeamByMilestone = (totalMilestones: number, currentMilestoneIndex: number, milestone_status_code_id: number): CampaignStatusConfig => {
    switch (milestone_status_code_id) {
        case MilestoneStatus_Code_Id.NOT_STARTED:
            return {
                label: `Active ${currentMilestoneIndex + 1}/${totalMilestones}`,
                labelClass: 'active',
                buttonsForCards: [ButtonTypes.VIEW_CAMPAIGN],
                buttonsForHeader: [],
                buttonsForDetails: [],
            };

        case MilestoneStatus_Code_Id.STARTED:
            return {
                label: `Active ${currentMilestoneIndex + 1}/${totalMilestones}`,
                labelClass: 'active',
                buttonsForCards: [ButtonTypes.VIEW_CAMPAIGN, ButtonTypes.SEND_MILESTONE_REPORT],
                buttonsForHeader: [ButtonTypes.SEND_MILESTONE_REPORT],
                buttonsForDetails: [],
            };

        case MilestoneStatus_Code_Id.SUBMITTED:
            return {
                label: `Reported ${currentMilestoneIndex + 1}/${totalMilestones}`,
                labelClass: 'active',
                buttonsForCards: [ButtonTypes.VIEW_CAMPAIGN, ButtonTypes.VIEW_MILESTONE_REPORT],
                buttonsForHeader: [ButtonTypes.VIEW_MILESTONE_REPORT],
                buttonsForDetails: [],
            };

        case MilestoneStatus_Code_Id.REJECTED:
            return {
                label: `Rejected ${currentMilestoneIndex + 1}/${totalMilestones}`,
                labelClass: 'active',
                buttonsForCards: [ButtonTypes.VIEW_CAMPAIGN, ButtonTypes.SEND_MILESTONE_REPORT],
                buttonsForHeader: [ButtonTypes.SEND_MILESTONE_REPORT],
                buttonsForDetails: [],
            };

        case MilestoneStatus_Code_Id.COLLECT:
            return {
                label: `Collect ${currentMilestoneIndex + 1}/${totalMilestones}`,
                labelClass: 'active',
                buttonsForCards: [ButtonTypes.VIEW_CAMPAIGN],
                buttonsForHeader: [],
                buttonsForDetails: [],
            };

        case MilestoneStatus_Code_Id.FAILED:
            return {
                label: `Failed ${currentMilestoneIndex + 1}/${totalMilestones}`,
                labelClass: 'active',
                buttonsForCards: [ButtonTypes.VIEW_CAMPAIGN],
                buttonsForHeader: [],
                buttonsForDetails: [],
            };

        default:
            throw new Error(`No Info found for milestone_status_code_id: ${milestone_status_code_id}`);
    }
};

export const CardInformationForManagersByMilestone = (totalMilestones: number, currentMilestoneIndex: number, milestone_status_code_id: number): CampaignStatusConfig => {
    switch (milestone_status_code_id) {
        case MilestoneStatus_Code_Id.NOT_STARTED:
            return {
                label: `Active ${currentMilestoneIndex + 1}/${totalMilestones}`,
                labelClass: 'active',
                buttonsForCards: [ButtonTypes.VIEW_CAMPAIGN],
                buttonsForHeader: [ButtonTypes.CONTACT_TEAM_SUPPORT],
                buttonsForDetails: [],
            };

        case MilestoneStatus_Code_Id.STARTED:
            return {
                label: `Active ${currentMilestoneIndex + 1}/${totalMilestones}`,
                labelClass: 'active',
                buttonsForCards: [ButtonTypes.VIEW_CAMPAIGN, ButtonTypes.SEND_MILESTONE_REPORT],
                buttonsForHeader: [ButtonTypes.SEND_MILESTONE_REPORT],
                buttonsForDetails: [],
            };

        case MilestoneStatus_Code_Id.SUBMITTED:
            return {
                label: `Reported ${currentMilestoneIndex + 1}/${totalMilestones}`,
                labelClass: 'active',
                buttonsForCards: [ButtonTypes.VIEW_CAMPAIGN, ButtonTypes.VIEW_MILESTONE_REPORT],
                buttonsForHeader: [ButtonTypes.VIEW_MILESTONE_REPORT],
                buttonsForDetails: [],
            };

        case MilestoneStatus_Code_Id.REJECTED:
            return {
                label: `Rejected ${currentMilestoneIndex + 1}/${totalMilestones}`,
                labelClass: 'active',
                buttonsForCards: [ButtonTypes.VIEW_CAMPAIGN, ButtonTypes.VIEW_MILESTONE_REPORT],
                buttonsForHeader: [ ButtonTypes.VIEW_MILESTONE_REPORT],
                buttonsForDetails: [],
            };

        case MilestoneStatus_Code_Id.COLLECT:
            return {
                label: `Collect ${currentMilestoneIndex + 1}/${totalMilestones}`,
                labelClass: 'active',
                buttonsForCards: [ButtonTypes.VIEW_CAMPAIGN, ButtonTypes.COLLECT_MILESTONE],
                buttonsForHeader: [ButtonTypes.COLLECT_MILESTONE],
                buttonsForDetails: [],
            };

        case MilestoneStatus_Code_Id.FAILED:
            return {
                label: `Failed ${currentMilestoneIndex + 1}/${totalMilestones}`,
                labelClass: 'active',
                buttonsForCards: [ButtonTypes.VIEW_CAMPAIGN],
                buttonsForHeader: [ButtonTypes.CONTACT_TEAM_SUPPORT],
                buttonsForDetails: [],
            };

        default:
            throw new Error(`No Info found for milestone_status_code_id: ${milestone_status_code_id}`);
    }
};
