import { HandlesEnums, ModalsEnums } from './constants';
import { CampaignTabEnum, ROUTES } from './routes';

//--------------------------------------------------------------

export interface ButtonType {
    label: string;
    action: (
        data?: Record<string, any>,
        navigate?: (url: string, as?: string, options?: any) => void,
        openModal?: (modal: ModalsEnums, data?: Record<string, any>, handles?: Partial<Record<HandlesEnums, (data?: Record<string, any>) => Promise<string | undefined | void>>>) => void,
        handles?: Partial<Record<HandlesEnums, (data?: Record<string, any>) => Promise<string | undefined | void>>>
    ) => Promise<void>;
    classNameType: string;
}

//--------------------------------------------------------------

export enum ButtonsForCardsEnum {
    VIEW_CAMPAIGN = 'VIEW_CAMPAIGN',
    // VIEW_CAMPAIGN_BLACK = 'VIEW_CAMPAIGN_BLACK',
    LEARN_MORE = 'LEARN_MORE',

    MANAGE_CAMPAIGN = 'MANAGE_CAMPAIGN',

    SUBMIT_CAMPAIGN = 'SUBMIT_CAMPAIGN',
    MANAGE_CAMPAIGN_SUBMISSIONS = 'MANAGE_CAMPAIGN_SUBMISSIONS',
    VIEW_CAMPAIGN_SUBMISSIONS = 'VIEW_CAMPAIGN_SUBMISSIONS',

    CREATE_CONTRACTS = 'CREATE_CONTRACTS',
    PUBLISH_CONTRACTS = 'PUBLISH_CONTRACTS',
    INITIALIZE_CAMPAIGN = 'INITIALIZE_CAMPAIGN',

    LAUNCH_CAMPAIGN = 'LAUNCH_CAMPAIGN',

    VIEW_MILESTONES = 'VIEW_MILESTONES',
    VIEW_TOKENOMICS = 'VIEW_TOKENOMICS',
    VIEW_MEMBERS = 'VIEW_MEMBERS',
    VIEW_FAQS = 'VIEW_FAQS',

    INVEST = 'INVEST',

    VALIDATE_FUNDRAISING = 'VALIDATE_FUNDRAISING',

    GETBACK_FAILED = 'GETBACK_FAILED',
    GETBACK_UNREACHED = 'GETBACK_UNREACHED',
    WITHDRAW_FAILED = 'WITHDRAW_FAILED',
    WITHDRAW_UNREACHED = 'WITHDRAW_UNREACHED',

    SUBMIT_MILESTONE = 'SUBMIT_MILESTONE',
    MANAGE_MILESTONE_SUBMISSIONS = 'MANAGE_MILESTONE_SUBMISSIONS',
    VIEW_MILESTONE_SUBMISSIONS = 'VIEW_MILESTONE_SUBMISSIONS',

    COLLECT_MILESTONE = 'COLLECT_MILESTONE',
}

export enum ButtonsForDetailsEnum {
    RENDER_CAMPAIGN_FOR_MANAGE = 'RENDER_CAMPAIGN_FOR_MANAGE',
    RENDER_CAMPAIGN_FOR_PAGE = 'RENDER_CAMPAIGN_FOR_PAGE',

    MANAGE_CAMPAIGN = 'MANAGE_CAMPAIGN',

    EDIT_CAMPAIGN = 'EDIT_CAMPAIGN',
    CANCEL_EDIT_CAMPAIGN = 'CANCEL_EDIT_CAMPAIGN',
    SAVE_CAMPAIGN = 'SAVE_CAMPAIGN',
    SAVE_DISABLED_CAMPAIGN = 'SAVE_DISABLED_CAMPAIGN',

    FEATURE_CAMPAIGN = 'FEATURE_CAMPAIGN',
    UNFEATURE_CAMPAIGN = 'UNFEATURE_CAMPAIGN',

    ARCHIVE_CAMPAIGN = 'ARCHIVE_CAMPAIGN',
    UNARCHIVE_CAMPAIGN = 'UNARCHIVE_CAMPAIGN',

    DELETE_CAMPAIGN = 'DELETE_CAMPAIGN',

    SUBMIT_CAMPAIGN = 'SUBMIT_CAMPAIGN',
    MANAGE_CAMPAIGN_SUBMISSIONS = 'MANAGE_CAMPAIGN_SUBMISSIONS',
    VIEW_CAMPAIGN_SUBMISSIONS = 'VIEW_CAMPAIGN_SUBMISSIONS',

    CONTACT_TEAM_SUPPORT = 'CONTACT_TEAM_SUPPORT',

    CREATE_CONTRACTS = 'CREATE_CONTRACTS',
    PUBLISH_CONTRACTS = 'PUBLISH_CONTRACTS',
    INITIALIZE_CAMPAIGN = 'INITIALIZE_CAMPAIGN',

    MANAGE_CAMPAIGN_UTXOS = 'MANAGE_CAMPAIGN_UTXOS',
    LAUNCH_CAMPAIGN = 'LAUNCH_CAMPAIGN',

    INVEST = 'INVEST',

    VALIDATE_FUNDRAISING = 'VALIDATE_FUNDRAISING',

    GETBACK_FAILED = 'GETBACK_FAILED',
    GETBACK_UNREACHED = 'GETBACK_UNREACHED',
    WITHDRAW_FAILED = 'WITHDRAW_FAILED',
    WITHDRAW_UNREACHED = 'WITHDRAW_UNREACHED',

    SUBMIT_MILESTONE = 'SUBMIT_MILESTONE',
    MANAGE_MILESTONE_SUBMISSIONS = 'MANAGE_MILESTONE_SUBMISSIONS',
    VIEW_MILESTONE_SUBMISSIONS = 'VIEW_MILESTONE_SUBMISSIONS',

    COLLECT_MILESTONE = 'COLLECT_MILESTONE',
}

//--------------------------------------------------------------

export const ButtonForCards: Record<ButtonsForCardsEnum, ButtonType> = {
    [ButtonsForCardsEnum.VIEW_CAMPAIGN]: {
        label: 'View Campaign >',
        action: async (data, navigate) => {
            if (data !== undefined && data.campaign_id !== undefined && navigate) navigate(`${ROUTES.campaignViewTab(data.campaign_id, CampaignTabEnum.DETAILS)}`);
        },
        classNameType: 'fill center',
    },
    // [ButtonsForCardsEnum.VIEW_CAMPAIGN_BLACK]: {
    //     label: 'View Campaign >',
    //     action: async (data, navigate) => {
    //         if (data !== undefined && data.campaign_id !== undefined && navigate) navigate(`${ROUTES.campaignViewTab(data.campaign_id, CampaignTabEnum.DETAILS)}`);
    //     },
    //     classNameType: 'fill center',
    // },
    [ButtonsForCardsEnum.LEARN_MORE]: {
        label: 'Learn More >',
        action: async (data, navigate) => {
            if (data !== undefined && data.campaign_id !== undefined && navigate) navigate(`${ROUTES.campaignViewTab(data.campaign_id, CampaignTabEnum.DETAILS)}`);
        },
        classNameType: 'fill center',
    },

    [ButtonsForCardsEnum.MANAGE_CAMPAIGN]: {
        label: 'Manage Campaign >',
        action: async (data, navigate) => {
            if (data !== undefined && data.campaign_id !== undefined && navigate) navigate(`${ROUTES.campaignManageTab(data.campaign_id, CampaignTabEnum.DETAILS)}`);
        },
        classNameType: 'fill center',
    },
    [ButtonsForCardsEnum.SUBMIT_CAMPAIGN]: {
        label: 'Submit Campaign >',
        action: async (data, _navigate, openModal, handles) => {
            if (data && openModal) openModal(ModalsEnums.SUBMIT_CAMPAIGN, data, handles);
        },
        classNameType: 'outline-card center',
    },
    [ButtonsForCardsEnum.MANAGE_CAMPAIGN_SUBMISSIONS]: {
        label: 'Manage Submissions >',
        action: async (data, _navigate, openModal, handles) => {
            if (data && openModal) openModal(ModalsEnums.MANAGE_CAMPAIGN_SUBMISSIONS, data, handles);
        },
        classNameType: 'outline-card center',
    },
    [ButtonsForCardsEnum.VIEW_CAMPAIGN_SUBMISSIONS]: {
        label: 'View Submissions >',
        action: async (data, _navigate, openModal, handles) => {
            if (data && openModal) openModal(ModalsEnums.VIEW_CAMPAIGN_SUBMISSIONS, data, handles);
        },
        classNameType: 'outline-card center',
    },

    [ButtonsForCardsEnum.CREATE_CONTRACTS]: {
        label: 'Create Contracts >',
        action: async (data, _navigate, openModal, handles) => {
            if (data && openModal) openModal(ModalsEnums.CREATE_SMART_CONTRACTS, data, handles);
        },
        classNameType: 'outline-card center',
    },
    [ButtonsForCardsEnum.PUBLISH_CONTRACTS]: {
        label: 'Publish Contracts >',
        action: async (data, _navigate, openModal, handles) => {
            if (data && openModal) openModal(ModalsEnums.PUBLISH_SMART_CONTRACTS, data, handles);
        },
        classNameType: 'outline-card center',
    },
    [ButtonsForCardsEnum.INITIALIZE_CAMPAIGN]: {
        label: 'Initialize Campaign >',
        action: async (data, _navigate, openModal, handles) => {
            if (data && openModal) openModal(ModalsEnums.INITIALIZE_CAMPAIGN, data, handles);
        },
        classNameType: 'outline-card center',
    },
    [ButtonsForCardsEnum.LAUNCH_CAMPAIGN]: {
        label: 'Launch Campaign >',
        action: async (data, _navigate, openModal, handles) => {
            if (data && openModal) openModal(ModalsEnums.LAUNCH_CAMPAIGN, data, handles);
        },
        classNameType: 'outline-card center',
    },
    [ButtonsForCardsEnum.VIEW_MILESTONES]: {
        label: 'View Milestones >',
        action: async (data, navigate) => {
            if (data !== undefined && data.campaign_id !== undefined && navigate) navigate(`${ROUTES.campaignViewTab(data.campaign_id, CampaignTabEnum.ROADMAP)}`);
        },
        classNameType: 'outline-card center',
    },
    [ButtonsForCardsEnum.VIEW_TOKENOMICS]: {
        label: 'View Tokenomics >',
        action: async (data, navigate) => {
            if (data !== undefined && data.campaign_id !== undefined && navigate) navigate(`${ROUTES.campaignViewTab(data.campaign_id, CampaignTabEnum.TOKENOMICS)}`);
        },
        classNameType: 'outline-card center',
    },
    [ButtonsForCardsEnum.VIEW_MEMBERS]: {
        label: 'View Members >',
        action: async (data, navigate) => {
            if (data !== undefined && data.campaign_id !== undefined && navigate) navigate(`${ROUTES.campaignViewTab(data.campaign_id, CampaignTabEnum.MEMBERS)}`);
        },
        classNameType: 'outline-card center',
    },
    [ButtonsForCardsEnum.VIEW_FAQS]: {
        label: 'View Q & A >',
        action: async (data, navigate) => {
            if (data !== undefined && data.campaign_id !== undefined && navigate) navigate(`${ROUTES.campaignViewTab(data.campaign_id, CampaignTabEnum.FAQS)}`);
        },
        classNameType: 'outline-card center',
    },
    [ButtonsForCardsEnum.INVEST]: {
        label: 'Invest >',
        action: async (data, navigate) => {
            if (data !== undefined && data.campaign_id !== undefined && navigate) navigate(`${ROUTES.campaignInvest(data.campaign_id)}`);
        },
        classNameType: 'invest center',
    },
    [ButtonsForCardsEnum.VALIDATE_FUNDRAISING]: {
        label: 'Validate Fundraising >',
        action: async (data, _navigate, openModal, handles) => {
            if (data && openModal) openModal(ModalsEnums.VALIDATE_FUNDRAISING_STATUS, data, handles);
        },
        classNameType: 'outline-card center',
    },

    [ButtonsForCardsEnum.GETBACK_FAILED]: {
        label: 'Get Back >',
        action: async (data, _navigate, openModal, handles) => {
            if (data && openModal) openModal(ModalsEnums.GETBACK_TOKENS_FAILED, data, handles);
        },
        classNameType: 'failed center',
    },
    [ButtonsForCardsEnum.GETBACK_UNREACHED]: {
        label: 'Get Back >',
        action: async (data, _navigate, openModal, handles) => {
            if (data && openModal) openModal(ModalsEnums.GETBACK_TOKENS_UNREACHED, data, handles);
        },
        classNameType: 'unreached center',
    },
    [ButtonsForCardsEnum.WITHDRAW_FAILED]: {
        label: 'Withdraw >',
        action: async (data, _navigate, openModal, handles) => {
            if (data && openModal) openModal(ModalsEnums.WITHDRAW_TOKENS_FAILED, data, handles);
        },
        classNameType: 'failed center',
    },
    [ButtonsForCardsEnum.WITHDRAW_UNREACHED]: {
        label: 'Withdraw >',
        action: async (data, _navigate, openModal, handles) => {
            if (data && openModal) openModal(ModalsEnums.WITHDRAW_TOKENS_UNREACHED, data, handles);
        },
        classNameType: 'unreached center',
    },

    [ButtonsForCardsEnum.SUBMIT_MILESTONE]: {
        label: 'Submit Milestone >',
        action: async (data, _navigate, openModal, handles) => {
            if (data && openModal) openModal(ModalsEnums.SUBMIT_MILESTONE, data, handles);
        },
        classNameType: 'outline-card center',
    },
    [ButtonsForCardsEnum.MANAGE_MILESTONE_SUBMISSIONS]: {
        label: 'Manage Submission >',
        action: async (data, _navigate, openModal, handles) => {
            if (data && openModal) openModal(ModalsEnums.MANAGE_MILESTONE_SUBMISSIONS, data, handles);
        },
        classNameType: 'outline-card center',
    },
    [ButtonsForCardsEnum.VIEW_MILESTONE_SUBMISSIONS]: {
        label: 'View Submission >',
        action: async (data, _navigate, openModal, handles) => {
            if (data && openModal) openModal(ModalsEnums.VIEW_MILESTONE_SUBMISSIONS, data, handles);
        },
        classNameType: 'outline-card center',
    },

    [ButtonsForCardsEnum.COLLECT_MILESTONE]: {
        label: 'Collect >',
        action: async (data, _navigate, openModal, handles) => {
            if (data && openModal) openModal(ModalsEnums.COLLECT_FUNDS, data, handles);
        },
        classNameType: 'outline-card center',
    },
};

export const ButtonForDetails: Record<ButtonsForDetailsEnum, ButtonType> = {
    [ButtonsForDetailsEnum.RENDER_CAMPAIGN_FOR_MANAGE]: {
        label: 'Overview >',
        action: async (data, navigate) => {
            if (data !== undefined && data.campaign_id !== undefined && navigate) navigate(`${ROUTES.campaignView(data.campaign_id)}`, undefined, { scroll: false });
        },
        classNameType: 'overview center',
    },
    [ButtonsForDetailsEnum.RENDER_CAMPAIGN_FOR_PAGE]: {
        label: 'Overview >',
        action: async (data, navigate) => {
            if (data !== undefined && data.campaign_id !== undefined && navigate) navigate(`${ROUTES.campaignView(data.campaign_id)}`, undefined, { scroll: false });
        },
        classNameType: 'overview center',
    },

    [ButtonsForDetailsEnum.MANAGE_CAMPAIGN]: {
        label: 'Manage',
        action: async (data, navigate) => {
            if (data !== undefined && data.campaign_id !== undefined && navigate) navigate(`${ROUTES.campaignManage(data.campaign_id)}`, undefined, { scroll: false });
        },
        classNameType: 'outline-card center',
    },

    [ButtonsForDetailsEnum.EDIT_CAMPAIGN]: {
        label: 'Edit',
        action: async (data, navigate) => {
            if (data !== undefined && data.campaign_id !== undefined && navigate) navigate(`${ROUTES.campaignEdit(data.campaign_id)}`, undefined, { scroll: false });
        },
        classNameType: 'outline-card center',
    },
    [ButtonsForDetailsEnum.CANCEL_EDIT_CAMPAIGN]: {
        label: 'Cancel',
        action: async (data, navigate) => {
            // agregar confirm cancel edit
            if (confirm('Are you sure you want to cancel the edition?')) {
                if (data !== undefined && data.campaign_id !== undefined && navigate) navigate(`${ROUTES.campaignManage(data.campaign_id)}`, undefined, { scroll: false });
            }
        },
        classNameType: 'red center',
    },
    [ButtonsForDetailsEnum.SAVE_CAMPAIGN]: {
        label: 'Save',
        action: async (data, navigate, _openModal, handles) => {
            if (confirm('Are you sure you want to save the edition?')) {
                if (handles && handles[HandlesEnums.SAVE_CAMPAIGN]) {
                    await handles[HandlesEnums.SAVE_CAMPAIGN](data);
                } else {
                    alert(`No handle ${HandlesEnums.SAVE_CAMPAIGN} provided`);
                }
                if (data !== undefined && data.campaign_id !== undefined && navigate) navigate(`${ROUTES.campaignManage(data.campaign_id)}`, undefined, { scroll: false });
            }
        },
        classNameType: 'green center',
    },
    [ButtonsForDetailsEnum.SAVE_DISABLED_CAMPAIGN]: {
        label: 'Save',
        action: async (data, navigate, _openModal, handles) => {
            alert(`There are errors in the form, please fix them before saving`);
        },
        classNameType: 'gray center',
    },

    [ButtonsForDetailsEnum.FEATURE_CAMPAIGN]: {
        label: 'Feature',
        action: async (data, _navigate, _openModal, handles) => {
            if (confirm('Are you sure you want to feature this campaignn?')) {
                if (handles && handles[HandlesEnums.FEATURE_CAMPAIGN]) {
                    await handles[HandlesEnums.FEATURE_CAMPAIGN](data);
                } else {
                    alert(`No handle ${HandlesEnums.FEATURE_CAMPAIGN} provided`);
                }
            }
        },
        classNameType: 'fill center',
    },
    [ButtonsForDetailsEnum.UNFEATURE_CAMPAIGN]: {
        label: 'Un-Feature',
        action: async (data, _navigate, _openModal, handles) => {
            if (confirm('Are you sure you want to undo feature this campaignn?')) {
                if (handles && handles[HandlesEnums.UN_FEATURE_CAMPAIGN]) {
                    await handles[HandlesEnums.UN_FEATURE_CAMPAIGN](data);
                } else {
                    alert(`No handle ${HandlesEnums.UN_FEATURE_CAMPAIGN} provided`);
                }
            }
        },
        classNameType: 'fill center',
    },

    [ButtonsForDetailsEnum.ARCHIVE_CAMPAIGN]: {
        label: 'Archive',
        action: async (data, _navigate, _openModal, handles) => {
            if (confirm('Are you sure you want to archive this campaignn?')) {
                if (handles && handles[HandlesEnums.ARCHIVE_CAMPAIGN]) {
                    await handles[HandlesEnums.ARCHIVE_CAMPAIGN](data);
                } else {
                    alert(`No handle ${HandlesEnums.ARCHIVE_CAMPAIGN} provided`);
                }
            }
        },
        classNameType: 'fill center',
    },
    [ButtonsForDetailsEnum.UNARCHIVE_CAMPAIGN]: {
        label: 'Un-Archive',
        action: async (data, _navigate, _openModal, handles) => {
            if (confirm('Are you sure you want to undo archive this campaignn?')) {
                if (handles && handles[HandlesEnums.UN_ARCHIVE_CAMPAIGN]) {
                    await handles[HandlesEnums.UN_ARCHIVE_CAMPAIGN](data);
                } else {
                    alert(`No handle ${HandlesEnums.UN_ARCHIVE_CAMPAIGN} provided`);
                }
            }
        },
        classNameType: 'fill center',
    },

    [ButtonsForDetailsEnum.DELETE_CAMPAIGN]: {
        label: 'Delete',
        action: async (data, _navigate, openModal, handles) => {
            if (data && openModal) openModal(ModalsEnums.DELETE_CAMPAIGN, data, handles);
        },
        classNameType: 'fill center',
    },

    [ButtonsForDetailsEnum.SUBMIT_CAMPAIGN]: {
        label: 'Submit',
        action: async (data, _navigate, openModal, handles) => {
            if (data && openModal) openModal(ModalsEnums.SUBMIT_CAMPAIGN, data, handles);
        },
        classNameType: 'fill center',
    },
    [ButtonsForDetailsEnum.MANAGE_CAMPAIGN_SUBMISSIONS]: {
        label: 'Manage Submissions',
        action: async (data, _navigate, openModal, handles) => {
            if (data && openModal) openModal(ModalsEnums.MANAGE_CAMPAIGN_SUBMISSIONS, data, handles);
        },
        classNameType: 'fill center',
    },
    [ButtonsForDetailsEnum.VIEW_CAMPAIGN_SUBMISSIONS]: {
        label: 'View Submissions',
        action: async (data, _navigate, openModal, handles) => {
            if (data && openModal) openModal(ModalsEnums.VIEW_CAMPAIGN_SUBMISSIONS, data, handles);
        },
        classNameType: 'fill center',
    },

    [ButtonsForDetailsEnum.CONTACT_TEAM_SUPPORT]: {
        label: 'Contact Team Support',
        action: async (data, _navigate, openModal, handles) => {
            if (data && openModal) openModal(ModalsEnums.CONTACT_SUPPORT, data, handles);
        },
        classNameType: 'fill center',
    },

    [ButtonsForDetailsEnum.CREATE_CONTRACTS]: {
        label: 'Create Contracts',
        action: async (data, _navigate, openModal, handles) => {
            if (data && openModal) openModal(ModalsEnums.CREATE_SMART_CONTRACTS, data, handles);
        },
        classNameType: 'fill center',
    },
    [ButtonsForDetailsEnum.PUBLISH_CONTRACTS]: {
        label: 'Publish Contracts',
        action: async (data, _navigate, openModal, handles) => {
            if (data && openModal) openModal(ModalsEnums.PUBLISH_SMART_CONTRACTS, data, handles);
        },
        classNameType: 'fill center',
    },
    [ButtonsForDetailsEnum.INITIALIZE_CAMPAIGN]: {
        label: 'Initialize',
        action: async (data, _navigate, openModal, handles) => {
            if (data && openModal) openModal(ModalsEnums.INITIALIZE_CAMPAIGN, data, handles);
        },
        classNameType: 'fill center',
    },

    [ButtonsForDetailsEnum.MANAGE_CAMPAIGN_UTXOS]: {
        label: 'Manage UTXOs',
        action: async (data, _navigate, openModal, handles) => {
            if (data && openModal) openModal(ModalsEnums.MANAGE_CAMPAIGN_UTXOS, data, handles);
        },
        classNameType: 'fill center',
    },
    [ButtonsForDetailsEnum.LAUNCH_CAMPAIGN]: {
        label: 'Launch',
        action: async (data, _navigate, openModal, handles) => {
            if (data && openModal) openModal(ModalsEnums.LAUNCH_CAMPAIGN, data, handles);
        },
        classNameType: 'fill center',
    },

    [ButtonsForDetailsEnum.INVEST]: {
        label: 'Invest',
        action: async (data, navigate) => {
            if (data !== undefined && data.campaign_id !== undefined && navigate) navigate(`${ROUTES.campaignInvest(data.campaign_id)}`);
        },
        classNameType: 'invest center',
    },

    [ButtonsForDetailsEnum.VALIDATE_FUNDRAISING]: {
        label: 'Validate Fundraising',
        action: async (data, _navigate, openModal, handles) => {
            if (data && openModal) openModal(ModalsEnums.VALIDATE_FUNDRAISING_STATUS, data, handles);
        },
        classNameType: 'fill center',
    },

    [ButtonsForDetailsEnum.GETBACK_FAILED]: {
        label: 'Get Back',
        action: async (data, _navigate, openModal, handles) => {
            if (data && openModal) openModal(ModalsEnums.GETBACK_TOKENS_FAILED, data, handles);
        },
        classNameType: 'failed center',
    },
    [ButtonsForDetailsEnum.GETBACK_UNREACHED]: {
        label: 'Get Back',
        action: async (data, _navigate, openModal, handles) => {
            if (data && openModal) openModal(ModalsEnums.GETBACK_TOKENS_UNREACHED, data, handles);
        },
        classNameType: 'unreached center',
    },
    [ButtonsForDetailsEnum.WITHDRAW_FAILED]: {
        label: 'Withdraw',
        action: async (data, _navigate, openModal, handles) => {
            if (data && openModal) openModal(ModalsEnums.WITHDRAW_TOKENS_FAILED, data, handles);
        },
        classNameType: 'failed center',
    },
    [ButtonsForDetailsEnum.WITHDRAW_UNREACHED]: {
        label: 'Withdraw',
        action: async (data, _navigate, openModal, handles) => {
            if (data && openModal) openModal(ModalsEnums.WITHDRAW_TOKENS_UNREACHED, data, handles);
        },
        classNameType: 'unreached center',
    },

    [ButtonsForDetailsEnum.SUBMIT_MILESTONE]: {
        label: 'Submit Milestone',
        action: async (data, _navigate, openModal, handles) => {
            if (data && openModal) openModal(ModalsEnums.SUBMIT_MILESTONE, data, handles);
        },
        classNameType: 'fill center',
    },
    [ButtonsForDetailsEnum.MANAGE_MILESTONE_SUBMISSIONS]: {
        label: 'Manage Submission',
        action: async (data, _navigate, openModal, handles) => {
            if (data && openModal) openModal(ModalsEnums.MANAGE_MILESTONE_SUBMISSIONS, data, handles);
        },
        classNameType: 'fill center',
    },
    [ButtonsForDetailsEnum.VIEW_MILESTONE_SUBMISSIONS]: {
        label: 'View Submission',
        action: async (data, _navigate, openModal, handles) => {
            if (data && openModal) openModal(ModalsEnums.VIEW_MILESTONE_SUBMISSIONS, data, handles);
        },
        classNameType: 'fill center',
    },

    [ButtonsForDetailsEnum.COLLECT_MILESTONE]: {
        label: 'Collect',
        action: async (data, _navigate, openModal, handles) => {
            if (data && openModal) openModal(ModalsEnums.COLLECT_FUNDS, data, handles);
        },
        classNameType: 'fill center',
    },
};

//--------------------------------------------------------------
