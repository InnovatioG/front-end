import { CampaignEX } from '@/types/types';
import { CampaignViewForEnums, HandleEnums, ModalEnums } from './constants';
import { CampaignTabEnum, ROUTES } from './routes';
import { CampaignStatus_Code_Id_Enums, MilestoneStatus_Code_Id_Enums } from './status';

export interface ButtonType {
    label: string;
    action: (
        data?: Record<string, any>,
        navigate?: (url: string, as?: string, options?: any) => void,
        openModal?: (modal: ModalEnums, data?: Record<string, any>) => void,
        handles?: Partial<Record<HandleEnums, (data?: Record<string, any>) => Promise<void>>>
    ) => Promise<void>;
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

export const StylesByCampaignStatus_Code_Id = (code_id: number, styles: { [key: string]: string }): string => {
    const statusStyles: Record<CampaignStatus_Code_Id_Enums, string> = {
        [CampaignStatus_Code_Id_Enums.NOT_STARTED]: styles.notStarted,
        [CampaignStatus_Code_Id_Enums.CREATED]: styles.created,
        [CampaignStatus_Code_Id_Enums.SUBMITTED]: styles.submitted,
        [CampaignStatus_Code_Id_Enums.REJECTED]: styles.rejected,
        [CampaignStatus_Code_Id_Enums.APPROVED]: styles.approved,
        [CampaignStatus_Code_Id_Enums.CONTRACT_CREATED]: styles.contractCreated,
        [CampaignStatus_Code_Id_Enums.CONTRACT_PUBLISHED]: styles.contractPublished,
        [CampaignStatus_Code_Id_Enums.CONTRACT_STARTED]: styles.contractStarted,
        [CampaignStatus_Code_Id_Enums.COUNTDOWN]: styles.countdown,
        [CampaignStatus_Code_Id_Enums.FUNDRAISING]: styles.fundraising,
        [CampaignStatus_Code_Id_Enums.FINISHING]: styles.finishing,
        [CampaignStatus_Code_Id_Enums.ACTIVE]: styles.active,
        [CampaignStatus_Code_Id_Enums.FAILED]: styles.failed,
        [CampaignStatus_Code_Id_Enums.UNREACHED]: styles.unreached,
        [CampaignStatus_Code_Id_Enums.SUCCESS]: styles.success,
    };

    if (statusStyles[code_id as CampaignStatus_Code_Id_Enums] === undefined) {
        throw new Error(`No style found for code_id: ${code_id}`);
    }

    return statusStyles[code_id as CampaignStatus_Code_Id_Enums];
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

export const StylesByMilestoneStatus_Code_Id = (code_id: number): string => {
    const statusStyles: Record<MilestoneStatus_Code_Id_Enums, string> = {
        [MilestoneStatus_Code_Id_Enums.NOT_STARTED]: 'notStarted',
        [MilestoneStatus_Code_Id_Enums.STARTED]: 'started',
        [MilestoneStatus_Code_Id_Enums.SUBMITTED]: 'submitted',
        [MilestoneStatus_Code_Id_Enums.REJECTED]: 'rejected',
        [MilestoneStatus_Code_Id_Enums.COLLECT]: 'collect',
        [MilestoneStatus_Code_Id_Enums.FINISHED]: 'finished',
        [MilestoneStatus_Code_Id_Enums.FAILED]: 'failed',
    };

    if (statusStyles[code_id as MilestoneStatus_Code_Id_Enums] === undefined) {
        throw new Error(`No style found for code_id: ${code_id}`);
    }

    return statusStyles[code_id as MilestoneStatus_Code_Id_Enums];
};

export const ImageByMilestoneStatus_Code_Id = (code_id: number): string => {
    const statusImages: Record<MilestoneStatus_Code_Id_Enums, string> = {
        [MilestoneStatus_Code_Id_Enums.NOT_STARTED]: '/img/icons/status/yellow.svg',
        [MilestoneStatus_Code_Id_Enums.STARTED]: '/img/icons/status/blue.svg',
        [MilestoneStatus_Code_Id_Enums.SUBMITTED]: '/img/icons/status/blue.svg',
        [MilestoneStatus_Code_Id_Enums.REJECTED]: '/img/icons/status/red.svg',
        [MilestoneStatus_Code_Id_Enums.COLLECT]: '/img/icons/status/blue.svg',
        [MilestoneStatus_Code_Id_Enums.FINISHED]: '/img/icons/status/green.svg',
        [MilestoneStatus_Code_Id_Enums.FAILED]: '/img/icons/status/red.svg',
    };

    if (statusImages[code_id as MilestoneStatus_Code_Id_Enums] === undefined) {
        throw new Error(`No image found for code_id: ${code_id}`);
    }

    return statusImages[code_id as MilestoneStatus_Code_Id_Enums];
};

//--------------------------------------------------------------

export enum ButtonTypeEnum {
    VIEW_CAMPAIGN = 'VIEW_CAMPAIGN',
    VIEW_CAMPAIGN_BLACK = 'VIEW_CAMPAIGN_BLACK',
    LEARN_MORE = 'LEARN_MORE',
    RENDER_CAMPAIGN_FOR_MANAGE = 'RENDER_CAMPAIGN',

    MANAGE_CAMPAIGN_FOR_CARD = 'MANAGE_CAMPAIGN_FOR_CARD',
    MANAGE_CAMPAIGN_FOR_DETAILS = 'MANAGE_CAMPAIGN_FOR_DETAILS',

    EDIT_CAMPAIGN = 'EDIT_CAMPAIGN',
    CANCEL_EDIT_CAMPAIGN = 'CANCEL_EDIT_CAMPAIGN',
    SAVE_CAMPAIGN = 'SAVE_CAMPAIGN',

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

export const ButtonTypes: Record<ButtonTypeEnum, ButtonType> = {
    [ButtonTypeEnum.VIEW_CAMPAIGN]: {
        label: 'View Campaign',
        action: async (data, navigate) => {
            if (data !== undefined && data.id !== undefined && navigate) navigate(`${ROUTES.campaignViewTab(data.id, CampaignTabEnum.DETAILS)}`);
        },
        classNameType: 'outline-card center',
    },
    [ButtonTypeEnum.VIEW_CAMPAIGN_BLACK]: {
        label: 'View Campaign',
        action: async (data, navigate) => {
            if (data !== undefined && data.id !== undefined && navigate) navigate(`${ROUTES.campaignViewTab(data.id, CampaignTabEnum.DETAILS)}`);
        },
        classNameType: 'fill center',
    },
    [ButtonTypeEnum.LEARN_MORE]: {
        label: 'Learn More',
        action: async (data, navigate) => {
            if (data !== undefined && data.id !== undefined && navigate) navigate(`${ROUTES.campaignViewTab(data.id, CampaignTabEnum.DETAILS)}`);
        },
        classNameType: 'fill center',
    },
    [ButtonTypeEnum.RENDER_CAMPAIGN_FOR_MANAGE]: {
        label: 'View',
        action: async (data, navigate) => {
            if (data !== undefined && data.id !== undefined && navigate) navigate(`${ROUTES.campaignView(data.id)}`, undefined, { scroll: false });
        },
        classNameType: 'outline-card center',
    },

    [ButtonTypeEnum.MANAGE_CAMPAIGN_FOR_CARD]: {
        label: 'Manage Campaign',
        action: async (data, navigate) => {
            if (data !== undefined && data.id !== undefined && navigate) navigate(`${ROUTES.campaignManageTab(data.id, CampaignTabEnum.DETAILS)}`);
        },
        classNameType: 'fill center',
    },
    [ButtonTypeEnum.MANAGE_CAMPAIGN_FOR_DETAILS]: {
        label: 'Manage Campaign',
        action: async (data, navigate) => {
            if (data !== undefined && data.id !== undefined && navigate) navigate(`${ROUTES.campaignManage(data.id)}`, undefined, { scroll: false });
        },
        classNameType: 'fill center',
    },

    [ButtonTypeEnum.EDIT_CAMPAIGN]: {
        label: 'Edit',
        action: async (data, navigate) => {
            if (data !== undefined && data.id !== undefined && navigate) navigate(`${ROUTES.campaignEdit(data.id)}`, undefined, { scroll: false });
        },
        classNameType: 'fill center',
    },
    [ButtonTypeEnum.CANCEL_EDIT_CAMPAIGN]: {
        label: 'Cancel',
        action: async (data, navigate) => {
            // agregar confirm cancel edit
            if (confirm('Are you sure you want to cancel the edition?')) {
                if (data !== undefined && data.id !== undefined && navigate) navigate(`${ROUTES.campaignManage(data.id)}`, undefined, { scroll: false });
            }
        },
        classNameType: 'fill center',
    },
    [ButtonTypeEnum.SAVE_CAMPAIGN]: {
        label: 'Save',
        action: async (data, navigate, _openModal, handles) => {
            if (confirm('Are you sure you want to save the edition?')) {
                if (handles && handles[HandleEnums.saveCampaign]) {
                    await handles[HandleEnums.saveCampaign](data);
                } else {
                    alert(`No handle ${HandleEnums.saveCampaign} provided`);
                }
                if (data !== undefined && data.id !== undefined && navigate) navigate(`${ROUTES.campaignManage(data.id)}`, undefined, { scroll: false });
            }
        },
        classNameType: 'fill center',
    },

    [ButtonTypeEnum.FEATURE_CAMPAIGN]: {
        label: 'Feature',
        // action: async (data, _navigate, openModal) => {
        //     if (data && openModal) openModal(ModalEnums.featureCampaign, data);
        // },
        action: async (data, _navigate, _openModal, handles) => {
            if (confirm('Are you sure you want to feature this campaignn?')) {
                if (handles && handles[HandleEnums.featureCampaign]) {
                    await handles[HandleEnums.featureCampaign](data);
                } else {
                    alert(`No handle ${HandleEnums.featureCampaign} provided`);
                }
            }
        },
        classNameType: 'fill center',
    },
    [ButtonTypeEnum.UNFEATURE_CAMPAIGN]: {
        label: 'Un-Feature',
        // action: async (data, _navigate, openModal) => {
        //     if (data && openModal) openModal(ModalEnums.featureCampaign, data);
        // },
        action: async (data, _navigate, _openModal, handles) => {
            if (confirm('Are you sure you want to undo feature this campaignn?')) {
                if (handles && handles[HandleEnums.unFeatureCampaign]) {
                    await handles[HandleEnums.unFeatureCampaign](data);
                } else {
                    alert(`No handle ${HandleEnums.unFeatureCampaign} provided`);
                }
            }
        },
        classNameType: 'fill center',
    },

    [ButtonTypeEnum.ARCHIVE_CAMPAIGN]: {
        label: 'Archive',
        action: async (data, _navigate, _openModal, handles) => {
            if (confirm('Are you sure you want to archive this campaignn?')) {
                if (handles && handles[HandleEnums.archiveCampaign]) {
                    await handles[HandleEnums.archiveCampaign](data);
                } else {
                    alert(`No handle ${HandleEnums.archiveCampaign} provided`);
                }
            }
        },
        // action: async (data, _navigate, openModal) => {
        //     if (data && openModal) openModal(ModalEnums.archiveCampaign, data);
        // },
        classNameType: 'fill center',
    },
    [ButtonTypeEnum.UNARCHIVE_CAMPAIGN]: {
        label: 'Un-Archive',
        action: async (data, _navigate, _openModal, handles) => {
            if (confirm('Are you sure you want to undo archive this campaignn?')) {
                if (handles && handles[HandleEnums.unArchiveCampaign]) await handles[HandleEnums.unArchiveCampaign](data);
            }
        },
        // action: async (data, _navigate, openModal) => {
        //     if (data && openModal) openModal(ModalEnums.archiveCampaign, data);
        // },
        classNameType: 'fill center',
    },

    [ButtonTypeEnum.DELETE_CAMPAIGN]: {
        label: 'Delete',
        action: async (data, _navigate, openModal) => {
            if (data && openModal) openModal(ModalEnums.deleteCampaign, data);
        },
        classNameType: 'fill center',
    },

    [ButtonTypeEnum.SUBMIT_CAMPAIGN]: {
        label: 'Submit',
        action: async (data, _navigate, openModal) => {
            if (data && openModal) openModal(ModalEnums.submitCampaign, data);
        },
        classNameType: 'fill center',
    },
    [ButtonTypeEnum.MANAGE_CAMPAIGN_SUBMISSIONS]: {
        label: 'Manage Submissions',
        action: async (data, _navigate, openModal) => {
            if (data && openModal) openModal(ModalEnums.manageCampaignSubmissions, data);
        },
        classNameType: 'fill center',
    },
    [ButtonTypeEnum.VIEW_CAMPAIGN_SUBMISSIONS]: {
        label: 'View Submissions',
        action: async (data, _navigate, openModal) => {
            if (data && openModal) openModal(ModalEnums.viewCampaignSubmissions, data);
        },
        classNameType: 'fill center',
    },

    [ButtonTypeEnum.CONTACT_TEAM_SUPPORT]: {
        label: 'Contact Team Support',
        action: async (data, _navigate, openModal) => {
            if (data && openModal) openModal(ModalEnums.contactSupport, data);
        },
        classNameType: 'fill center',
    },

    [ButtonTypeEnum.CREATE_CONTRACTS]: {
        label: 'Create Contracts',
        action: async (data, _navigate, openModal) => {
            if (data && openModal) openModal(ModalEnums.createSmartContracts, data);
        },
        classNameType: 'fill center',
    },
    [ButtonTypeEnum.PUBLISH_CONTRACTS]: {
        label: 'Publish Contracts',
        action: async (data, _navigate, openModal) => {
            if (data && openModal) openModal(ModalEnums.publishSmartContracts, data);
        },
        classNameType: 'fill center',
    },
    [ButtonTypeEnum.INITIALIZE_CAMPAIGN]: {
        label: 'Initialize',
        action: async (data, _navigate, openModal) => {
            if (data && openModal) openModal(ModalEnums.initializeCampaign, data);
        },
        classNameType: 'fill center',
    },

    [ButtonTypeEnum.MANAGE_CAMPAIGN_UTXOS]: {
        label: 'Manage UTXOs',
        action: async (data, _navigate, openModal) => {
            if (data && openModal) openModal(ModalEnums.manageCampaignUTXOs, data);
        },
        classNameType: 'fill center center',
    },
    [ButtonTypeEnum.LAUNCH_CAMPAIGN]: {
        label: 'Launch',
        action: async (data, _navigate, openModal) => {
            if (data && openModal) openModal(ModalEnums.launchCampaign, data);
        },
        classNameType: 'fill center center',
    },

    [ButtonTypeEnum.VIEW_MILESTONES]: {
        label: 'View Milestones',
        action: async (data, navigate) => {
            if (data !== undefined && data.id !== undefined && navigate) navigate(`${ROUTES.campaignViewTab(data.id, CampaignTabEnum.ROADMAP)}`);
        },
        classNameType: 'outline-card center',
    },
    [ButtonTypeEnum.VIEW_TOKENOMICS]: {
        label: 'View Tokenomics',
        action: async (data, navigate) => {
            if (data !== undefined && data.id !== undefined && navigate) navigate(`${ROUTES.campaignViewTab(data.id, CampaignTabEnum.TOKENOMICS)}`);
        },
        classNameType: 'outline-card center',
    },
    [ButtonTypeEnum.VIEW_MEMBERS]: {
        label: 'View Members',
        action: async (data, navigate) => {
            if (data !== undefined && data.id !== undefined && navigate) navigate(`${ROUTES.campaignViewTab(data.id, CampaignTabEnum.MEMBERS)}`);
        },
        classNameType: 'outline-card center',
    },
    [ButtonTypeEnum.VIEW_FAQS]: {
        label: 'View Q & A',
        action: async (data, navigate) => {
            if (data !== undefined && data.id !== undefined && navigate) navigate(`${ROUTES.campaignViewTab(data.id, CampaignTabEnum.FAQS)}`);
        },
        classNameType: 'outline-card center',
    },

    [ButtonTypeEnum.INVEST]: {
        label: 'Invest',
        action: async (data, navigate) => {
            if (data !== undefined && data.id !== undefined && navigate) navigate(`${ROUTES.campaignInvest(data.id)}`);
        },
        classNameType: 'invest center',
    },

    [ButtonTypeEnum.VALIDATE_FUNDRAISING]: {
        label: 'Validate Fundraising',
        action: async (data, _navigate, openModal) => {
            if (data && openModal) openModal(ModalEnums.validateFundraisingStatus, data);
        },
        classNameType: 'outline-card center',
    },

    [ButtonTypeEnum.GETBACK_FAILED]: {
        label: 'Get Back',
        action: async (data, _navigate, openModal) => {
            if (data && openModal) openModal(ModalEnums.withdrawTokensFailed, data);
        },
        classNameType: 'failed center',
    },
    [ButtonTypeEnum.GETBACK_UNREACHED]: {
        label: 'Get Back',
        action: async (data, _navigate, openModal) => {
            if (data && openModal) openModal(ModalEnums.withdrawTokensFailed, data);
        },
        classNameType: 'failed center',
    },
    [ButtonTypeEnum.WITHDRAW_FAILED]: {
        label: 'Withdraw',
        action: async (data, _navigate, openModal) => {
            if (data && openModal) openModal(ModalEnums.withdrawTokensUnreached, data);
        },
        classNameType: 'unreached center',
    },
    [ButtonTypeEnum.WITHDRAW_UNREACHED]: {
        label: 'Withdraw',
        action: async (data, _navigate, openModal) => {
            if (data && openModal) openModal(ModalEnums.withdrawTokensUnreached, data);
        },
        classNameType: 'unreached center',
    },

    [ButtonTypeEnum.SUBMIT_MILESTONE]: {
        label: 'Submit Milestone',
        action: async (data, _navigate, openModal) => {
            if (data && openModal) openModal(ModalEnums.submitMilestone, data); // { campaign_id: campaign.campaign._DB_id, campaign }
        },
        classNameType: 'fill center',
    },
    [ButtonTypeEnum.MANAGE_MILESTONE_SUBMISSIONS]: {
        label: 'Manage Submission',
        action: async (data, _navigate, openModal) => {
            if (data && openModal) openModal(ModalEnums.manageMilestoneSubmissions, data);
        },
        classNameType: 'fill center',
    },
    [ButtonTypeEnum.VIEW_MILESTONE_SUBMISSIONS]: {
        label: 'View Submission',
        action: async (data, _navigate, openModal) => {
            if (data && openModal) openModal(ModalEnums.viewMilestoneSubmissions, data);
        },
        classNameType: 'fill center',
    },

    [ButtonTypeEnum.COLLECT_MILESTONE]: {
        label: 'Collect',
        action: async (data, _navigate, openModal) => {
            if (data && openModal) openModal(ModalEnums.collectFunds, data);
        },
        classNameType: 'fill center',
    },
};

export const campaignConfig = (
    campaign: CampaignEX,
    isProtocolTeam: boolean,
    isAdmin: boolean,
    isEditor: boolean,
    isEditMode: boolean,
    campaignViewFor: CampaignViewForEnums,
    campaign_status_code_id: number,
    totalMilestones: number,
    currentMilestoneIndex?: number,
    milestone_status_code_id?: number
): CampaignStatusConfig => {
    const isManagePage = campaignViewFor === CampaignViewForEnums.manage;

    const MANAGE_EDIT_OR_SAVE = (buttonsInManageAndNotInEditMode: ButtonType[], buttonsNotInManage: ButtonType[] = [], swAddContact: boolean = false) => {
        return isManagePage === false
            ? [ButtonTypes[ButtonTypeEnum.MANAGE_CAMPAIGN_FOR_DETAILS], ...buttonsNotInManage, ...(swAddContact === true ? [CONTACT] : [])]
            : isEditMode === false
            ? [
                  ButtonTypes[ButtonTypeEnum.RENDER_CAMPAIGN_FOR_MANAGE],
                  ButtonTypes[ButtonTypeEnum.EDIT_CAMPAIGN],
                  ...buttonsInManageAndNotInEditMode,
                  ...(swAddContact === true ? [CONTACT] : []),
              ]
            : [ButtonTypes[ButtonTypeEnum.CANCEL_EDIT_CAMPAIGN], ButtonTypes[ButtonTypeEnum.SAVE_CAMPAIGN]];
    };

    const MANAGE_OR_SAVE = (buttonsInManageAndNotInEditMode: ButtonType[], buttonsNotInManage: ButtonType[] = [], swAddContact: boolean = false) => {
        return isManagePage === false
            ? [ButtonTypes[ButtonTypeEnum.MANAGE_CAMPAIGN_FOR_DETAILS], ...buttonsNotInManage, ...(swAddContact === true ? [CONTACT] : [])]
            : isEditMode === false
            ? [ButtonTypes[ButtonTypeEnum.RENDER_CAMPAIGN_FOR_MANAGE], ...buttonsInManageAndNotInEditMode, ...(swAddContact === true ? [CONTACT] : [])]
            : [ButtonTypes[ButtonTypeEnum.CANCEL_EDIT_CAMPAIGN], ButtonTypes[ButtonTypeEnum.SAVE_CAMPAIGN]];
    };

    const MANAGE = (buttonsInManageAndNotInEditMode: ButtonType[], buttonsNotInManage: ButtonType[] = [], swAddContact: boolean = false) => {
        return isManagePage === false
            ? [ButtonTypes[ButtonTypeEnum.MANAGE_CAMPAIGN_FOR_DETAILS], ...buttonsNotInManage, ...(swAddContact === true ? [CONTACT] : [])]
            : [ButtonTypes[ButtonTypeEnum.RENDER_CAMPAIGN_FOR_MANAGE], ...buttonsInManageAndNotInEditMode, ...(swAddContact === true ? [CONTACT] : [])];
    };

    const VIEW_OR_MANAGE_FOR_CARD = isManagePage === false ? ButtonTypes[ButtonTypeEnum.VIEW_CAMPAIGN] : ButtonTypes[ButtonTypeEnum.MANAGE_CAMPAIGN_FOR_CARD];
    const LEARN_OR_MANAGE_FOR_CARD = isManagePage === false ? ButtonTypes[ButtonTypeEnum.LEARN_MORE] : ButtonTypes[ButtonTypeEnum.MANAGE_CAMPAIGN_FOR_CARD];

    const LEARN = ButtonTypes[ButtonTypeEnum.LEARN_MORE];
    const CONTACT = ButtonTypes[ButtonTypeEnum.CONTACT_TEAM_SUPPORT];
    const UTXO = ButtonTypes[ButtonTypeEnum.MANAGE_CAMPAIGN_UTXOS];

    const FOR_PROTOCOL_ARCHIVE_AND_DELETE = [
        campaign.campaign.featured === false ? ButtonTypes[ButtonTypeEnum.FEATURE_CAMPAIGN] : ButtonTypes[ButtonTypeEnum.UNFEATURE_CAMPAIGN],
        campaign.campaign.archived === false ? ButtonTypes[ButtonTypeEnum.ARCHIVE_CAMPAIGN] : ButtonTypes[ButtonTypeEnum.UNARCHIVE_CAMPAIGN],
        ButtonTypes[ButtonTypeEnum.DELETE_CAMPAIGN],
    ];
    const FOR_PROTOCOL_UTXOS_ARCHIVE_AND_DELETE = [
        ButtonTypes[ButtonTypeEnum.MANAGE_CAMPAIGN_UTXOS],
        campaign.campaign.featured === false ? ButtonTypes[ButtonTypeEnum.FEATURE_CAMPAIGN] : ButtonTypes[ButtonTypeEnum.UNFEATURE_CAMPAIGN],
        campaign.campaign.archived === false ? ButtonTypes[ButtonTypeEnum.ARCHIVE_CAMPAIGN] : ButtonTypes[ButtonTypeEnum.UNARCHIVE_CAMPAIGN],
        ButtonTypes[ButtonTypeEnum.DELETE_CAMPAIGN],
    ];

    switch (campaign_status_code_id) {
        case CampaignStatus_Code_Id_Enums.NOT_STARTED:
            return {
                label: 'Draft',
                labelClass: 'draft',
                buttonsForCards: [ButtonTypes[ButtonTypeEnum.VIEW_CAMPAIGN]],
                buttonsForHeader: [],
                buttonsForDetails: [],
            };
        case CampaignStatus_Code_Id_Enums.CREATED:
            if (isProtocolTeam === true) {
                return {
                    label: 'Draft',
                    labelClass: 'draft',
                    buttonsForCards: [ButtonTypes[ButtonTypeEnum.SUBMIT_CAMPAIGN], VIEW_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE_OR_SAVE([ButtonTypes[ButtonTypeEnum.SUBMIT_CAMPAIGN]]),
                    buttonsForDetails: MANAGE_EDIT_OR_SAVE([ButtonTypes[ButtonTypeEnum.SUBMIT_CAMPAIGN], ...FOR_PROTOCOL_ARCHIVE_AND_DELETE]),
                };
            } else if (isAdmin === true) {
                return {
                    label: 'Draft',
                    labelClass: 'draft',
                    buttonsForCards: [ButtonTypes[ButtonTypeEnum.SUBMIT_CAMPAIGN], VIEW_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE_OR_SAVE([ButtonTypes[ButtonTypeEnum.SUBMIT_CAMPAIGN]]),
                    buttonsForDetails: MANAGE_EDIT_OR_SAVE([ButtonTypes[ButtonTypeEnum.SUBMIT_CAMPAIGN], ButtonTypes[ButtonTypeEnum.DELETE_CAMPAIGN]], [], true),
                };
            } else if (isEditor === true) {
                return {
                    label: 'Draft',
                    labelClass: 'draft',
                    buttonsForCards: [ButtonTypes[ButtonTypeEnum.SUBMIT_CAMPAIGN], VIEW_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE_OR_SAVE([ButtonTypes[ButtonTypeEnum.SUBMIT_CAMPAIGN]]),
                    buttonsForDetails: MANAGE_EDIT_OR_SAVE([ButtonTypes[ButtonTypeEnum.SUBMIT_CAMPAIGN]], [], true),
                };
            } else {
                return {
                    label: 'Draft',
                    labelClass: 'draft',
                    buttonsForCards: [],
                    buttonsForHeader: [],
                    buttonsForDetails: [],
                };
            }

        case CampaignStatus_Code_Id_Enums.SUBMITTED:
            if (isProtocolTeam === true) {
                return {
                    label: 'Attempt to Launch',
                    labelClass: 'attempt-to-launch',
                    buttonsForCards: [ButtonTypes[ButtonTypeEnum.MANAGE_CAMPAIGN_SUBMISSIONS], VIEW_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE_OR_SAVE([ButtonTypes[ButtonTypeEnum.MANAGE_CAMPAIGN_SUBMISSIONS]]),
                    buttonsForDetails: MANAGE_EDIT_OR_SAVE([
                        ButtonTypes[ButtonTypeEnum.MANAGE_CAMPAIGN_SUBMISSIONS],
                        ButtonTypes[ButtonTypeEnum.VIEW_CAMPAIGN_SUBMISSIONS],
                        ...FOR_PROTOCOL_ARCHIVE_AND_DELETE,
                    ]),
                };
            } else if (isAdmin === true) {
                return {
                    label: 'Submitted',
                    labelClass: 'submitted',
                    buttonsForCards: [ButtonTypes[ButtonTypeEnum.VIEW_CAMPAIGN_SUBMISSIONS], VIEW_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE([ButtonTypes[ButtonTypeEnum.VIEW_CAMPAIGN_SUBMISSIONS]]),
                    buttonsForDetails: MANAGE([ButtonTypes[ButtonTypeEnum.VIEW_CAMPAIGN_SUBMISSIONS]], [], true),
                };
            } else if (isEditor === true) {
                return {
                    label: 'Submitted',
                    labelClass: 'submitted',
                    buttonsForCards: [ButtonTypes[ButtonTypeEnum.VIEW_CAMPAIGN_SUBMISSIONS], VIEW_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE([ButtonTypes[ButtonTypeEnum.VIEW_CAMPAIGN_SUBMISSIONS]]),
                    buttonsForDetails: MANAGE([ButtonTypes[ButtonTypeEnum.VIEW_CAMPAIGN_SUBMISSIONS]], [], true),
                };
            } else {
                return {
                    label: 'Submitted',
                    labelClass: 'submitted',
                    buttonsForCards: [],
                    buttonsForHeader: [],
                    buttonsForDetails: [],
                };
            }

        case CampaignStatus_Code_Id_Enums.REJECTED:
            if (isProtocolTeam === true) {
                return {
                    label: 'Rejected',
                    labelClass: 'rejected',
                    buttonsForCards: [ButtonTypes[ButtonTypeEnum.VIEW_CAMPAIGN_SUBMISSIONS], VIEW_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE_OR_SAVE([ButtonTypes[ButtonTypeEnum.VIEW_CAMPAIGN_SUBMISSIONS]]),
                    buttonsForDetails: MANAGE_EDIT_OR_SAVE([
                        ButtonTypes[ButtonTypeEnum.VIEW_CAMPAIGN_SUBMISSIONS],
                        ButtonTypes[ButtonTypeEnum.SUBMIT_CAMPAIGN],
                        ...FOR_PROTOCOL_ARCHIVE_AND_DELETE,
                    ]),
                };
            } else if (isAdmin === true) {
                return {
                    label: 'Rejected',
                    labelClass: 'rejected',
                    buttonsForCards: [ButtonTypes[ButtonTypeEnum.VIEW_CAMPAIGN_SUBMISSIONS], VIEW_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE_OR_SAVE([ButtonTypes[ButtonTypeEnum.VIEW_CAMPAIGN_SUBMISSIONS]]),
                    buttonsForDetails: MANAGE_EDIT_OR_SAVE(
                        [ButtonTypes[ButtonTypeEnum.VIEW_CAMPAIGN_SUBMISSIONS], ButtonTypes[ButtonTypeEnum.SUBMIT_CAMPAIGN], ButtonTypes[ButtonTypeEnum.DELETE_CAMPAIGN]],
                        [],
                        true
                    ),
                };
            } else if (isEditor === true) {
                return {
                    label: 'Rejected',
                    labelClass: 'rejected',
                    buttonsForCards: [ButtonTypes[ButtonTypeEnum.VIEW_CAMPAIGN_SUBMISSIONS], VIEW_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE_OR_SAVE([ButtonTypes[ButtonTypeEnum.VIEW_CAMPAIGN_SUBMISSIONS]]),
                    buttonsForDetails: MANAGE_EDIT_OR_SAVE([ButtonTypes[ButtonTypeEnum.VIEW_CAMPAIGN_SUBMISSIONS], ButtonTypes[ButtonTypeEnum.SUBMIT_CAMPAIGN]], [], true),
                };
            } else {
                return {
                    label: 'Rejected',
                    labelClass: 'rejected',
                    buttonsForCards: [],
                    buttonsForHeader: [],
                    buttonsForDetails: [],
                };
            }

        case CampaignStatus_Code_Id_Enums.APPROVED:
            if (isProtocolTeam === true) {
                return {
                    label: 'Approved',
                    labelClass: 'approved',
                    buttonsForCards: [ButtonTypes[ButtonTypeEnum.CREATE_CONTRACTS], VIEW_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE_OR_SAVE([ButtonTypes[ButtonTypeEnum.CREATE_CONTRACTS]]),
                    buttonsForDetails: MANAGE_EDIT_OR_SAVE([
                        ButtonTypes[ButtonTypeEnum.CREATE_CONTRACTS],
                        ButtonTypes[ButtonTypeEnum.VIEW_CAMPAIGN_SUBMISSIONS],
                        ...FOR_PROTOCOL_ARCHIVE_AND_DELETE,
                    ]),
                };
            } else if (isAdmin === true) {
                return {
                    label: 'Approved',
                    labelClass: 'approved',
                    buttonsForCards: [ButtonTypes[ButtonTypeEnum.VIEW_CAMPAIGN_SUBMISSIONS], VIEW_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE([ButtonTypes[ButtonTypeEnum.VIEW_CAMPAIGN_SUBMISSIONS]]),
                    buttonsForDetails: MANAGE([ButtonTypes[ButtonTypeEnum.VIEW_CAMPAIGN_SUBMISSIONS]], [], true),
                };
            } else if (isEditor === true) {
                return {
                    label: 'Approved',
                    labelClass: 'approved',
                    buttonsForCards: [ButtonTypes[ButtonTypeEnum.VIEW_CAMPAIGN_SUBMISSIONS], VIEW_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE([ButtonTypes[ButtonTypeEnum.VIEW_CAMPAIGN_SUBMISSIONS]]),
                    buttonsForDetails: MANAGE([ButtonTypes[ButtonTypeEnum.VIEW_CAMPAIGN_SUBMISSIONS]], [], true),
                };
            } else {
                return {
                    label: 'Approved',
                    labelClass: 'approved',
                    buttonsForCards: [],
                    buttonsForHeader: [],
                    buttonsForDetails: [],
                };
            }

        case CampaignStatus_Code_Id_Enums.CONTRACT_CREATED:
            if (isProtocolTeam === true) {
                return {
                    label: 'Created',
                    labelClass: 'created',
                    buttonsForCards: [ButtonTypes[ButtonTypeEnum.PUBLISH_CONTRACTS], VIEW_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE_OR_SAVE([ButtonTypes[ButtonTypeEnum.PUBLISH_CONTRACTS]]),
                    buttonsForDetails: MANAGE_EDIT_OR_SAVE([ButtonTypes[ButtonTypeEnum.PUBLISH_CONTRACTS], ...FOR_PROTOCOL_ARCHIVE_AND_DELETE]),
                };
            } else if (isAdmin === true) {
                return {
                    label: 'Created',
                    labelClass: 'created',
                    buttonsForCards: [ButtonTypes[ButtonTypeEnum.VIEW_CAMPAIGN_SUBMISSIONS], VIEW_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE([ButtonTypes[ButtonTypeEnum.VIEW_CAMPAIGN_SUBMISSIONS]]),
                    buttonsForDetails: MANAGE([ButtonTypes[ButtonTypeEnum.VIEW_CAMPAIGN_SUBMISSIONS]], [], true),
                };
            } else if (isEditor === true) {
                return {
                    label: 'Created',
                    labelClass: 'created',
                    buttonsForCards: [ButtonTypes[ButtonTypeEnum.VIEW_CAMPAIGN_SUBMISSIONS], VIEW_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE([ButtonTypes[ButtonTypeEnum.VIEW_CAMPAIGN_SUBMISSIONS]]),
                    buttonsForDetails: MANAGE([ButtonTypes[ButtonTypeEnum.VIEW_CAMPAIGN_SUBMISSIONS]], [], true),
                };
            } else {
                return {
                    label: 'Created',
                    labelClass: 'created',
                    buttonsForCards: [],
                    buttonsForHeader: [],
                    buttonsForDetails: [],
                };
            }

        case CampaignStatus_Code_Id_Enums.CONTRACT_PUBLISHED:
            if (isProtocolTeam === true) {
                return {
                    label: 'Deploy',
                    labelClass: 'deploy',
                    buttonsForCards: [ButtonTypes[ButtonTypeEnum.INITIALIZE_CAMPAIGN], VIEW_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE_OR_SAVE([ButtonTypes[ButtonTypeEnum.INITIALIZE_CAMPAIGN]]),
                    buttonsForDetails: MANAGE_EDIT_OR_SAVE([ButtonTypes[ButtonTypeEnum.INITIALIZE_CAMPAIGN], ...FOR_PROTOCOL_ARCHIVE_AND_DELETE]),
                };
            } else if (isAdmin === true) {
                return {
                    label: 'Deploy',
                    labelClass: 'deploy',
                    buttonsForCards: [ButtonTypes[ButtonTypeEnum.VIEW_CAMPAIGN_SUBMISSIONS], VIEW_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE([ButtonTypes[ButtonTypeEnum.VIEW_CAMPAIGN_SUBMISSIONS]]),
                    buttonsForDetails: MANAGE([ButtonTypes[ButtonTypeEnum.VIEW_CAMPAIGN_SUBMISSIONS]], [], true),
                };
            } else if (isEditor === true) {
                return {
                    label: 'Deploy',
                    labelClass: 'deploy',
                    buttonsForCards: [ButtonTypes[ButtonTypeEnum.VIEW_CAMPAIGN_SUBMISSIONS], VIEW_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE([ButtonTypes[ButtonTypeEnum.VIEW_CAMPAIGN_SUBMISSIONS]]),
                    buttonsForDetails: MANAGE([ButtonTypes[ButtonTypeEnum.VIEW_CAMPAIGN_SUBMISSIONS]], [], true),
                };
            } else {
                return {
                    label: 'Deploy',
                    labelClass: 'deploy',
                    buttonsForCards: [],
                    buttonsForHeader: [],
                    buttonsForDetails: [],
                };
            }
        case CampaignStatus_Code_Id_Enums.CONTRACT_STARTED:
            if (isProtocolTeam === true) {
                return {
                    label: 'Ready',
                    labelClass: 'ready',
                    buttonsForCards: [ButtonTypes[ButtonTypeEnum.LAUNCH_CAMPAIGN], VIEW_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE_OR_SAVE([ButtonTypes[ButtonTypeEnum.LAUNCH_CAMPAIGN]]),
                    buttonsForDetails: MANAGE_EDIT_OR_SAVE([ButtonTypes[ButtonTypeEnum.LAUNCH_CAMPAIGN], ...FOR_PROTOCOL_UTXOS_ARCHIVE_AND_DELETE]),
                };
            } else if (isAdmin === true) {
                return {
                    label: 'Ready',
                    labelClass: 'ready',
                    buttonsForCards: [ButtonTypes[ButtonTypeEnum.LAUNCH_CAMPAIGN], VIEW_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE([ButtonTypes[ButtonTypeEnum.LAUNCH_CAMPAIGN]]),
                    buttonsForDetails: MANAGE([ButtonTypes[ButtonTypeEnum.LAUNCH_CAMPAIGN], UTXO], [], true),
                };
            } else if (isEditor === true) {
                return {
                    label: 'Ready',
                    labelClass: 'ready',
                    buttonsForCards: [LEARN],
                    buttonsForHeader: [CONTACT],
                    buttonsForDetails: [CONTACT],
                };
            } else {
                return {
                    label: 'Ready',
                    labelClass: 'ready',
                    buttonsForCards: [],
                    buttonsForHeader: [],
                    buttonsForDetails: [],
                };
            }

        case CampaignStatus_Code_Id_Enums.COUNTDOWN:
            if (isProtocolTeam === true) {
                return {
                    label: 'Countdown',
                    labelClass: 'countdown',
                    buttonsForCards: [ButtonTypes[ButtonTypeEnum.VIEW_MILESTONES], LEARN_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE_OR_SAVE([UTXO]),
                    buttonsForDetails: MANAGE_EDIT_OR_SAVE(FOR_PROTOCOL_UTXOS_ARCHIVE_AND_DELETE),
                };
            } else if (isAdmin === true) {
                return {
                    label: 'Countdown',
                    labelClass: 'countdown',
                    buttonsForCards: [ButtonTypes[ButtonTypeEnum.VIEW_MILESTONES], LEARN_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE([UTXO]),
                    buttonsForDetails: MANAGE([UTXO], [], true),
                };
            } else {
                return {
                    label: 'Countdown',
                    labelClass: 'countdown',
                    buttonsForCards: [ButtonTypes[ButtonTypeEnum.VIEW_MILESTONES], LEARN],
                    buttonsForHeader: [CONTACT],
                    buttonsForDetails: [CONTACT],
                };
            }

        case CampaignStatus_Code_Id_Enums.FUNDRAISING:
            if (isProtocolTeam === true) {
                return {
                    label: 'Fundraising',
                    labelClass: 'fundraising',
                    buttonsForCards: [ButtonTypes[ButtonTypeEnum.INVEST], LEARN_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE_OR_SAVE([UTXO], [ButtonTypes[ButtonTypeEnum.INVEST]]),
                    buttonsForDetails: MANAGE_EDIT_OR_SAVE(FOR_PROTOCOL_UTXOS_ARCHIVE_AND_DELETE, [ButtonTypes[ButtonTypeEnum.INVEST]]),
                };
            } else if (isAdmin === true) {
                return {
                    label: 'Fundraising',
                    labelClass: 'fundraising',
                    buttonsForCards: [ButtonTypes[ButtonTypeEnum.INVEST], LEARN_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE([UTXO], [ButtonTypes[ButtonTypeEnum.INVEST]]),
                    buttonsForDetails: MANAGE([UTXO], [ButtonTypes[ButtonTypeEnum.INVEST]], true),
                };
            } else {
                return {
                    label: 'Fundraising',
                    labelClass: 'fundraising',
                    buttonsForCards: [ButtonTypes[ButtonTypeEnum.INVEST], LEARN],
                    buttonsForHeader: [ButtonTypes[ButtonTypeEnum.INVEST]],
                    buttonsForDetails: [ButtonTypes[ButtonTypeEnum.INVEST], CONTACT],
                };
            }

        case CampaignStatus_Code_Id_Enums.FINISHING:
            if (isProtocolTeam === true) {
                return {
                    label: 'Finishing',
                    labelClass: 'finishing',
                    buttonsForCards: [ButtonTypes[ButtonTypeEnum.VALIDATE_FUNDRAISING], LEARN_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE_OR_SAVE([ButtonTypes[ButtonTypeEnum.VALIDATE_FUNDRAISING]]),
                    buttonsForDetails: MANAGE_EDIT_OR_SAVE([ButtonTypes[ButtonTypeEnum.VALIDATE_FUNDRAISING], ...FOR_PROTOCOL_UTXOS_ARCHIVE_AND_DELETE]),
                };
            } else if (isAdmin === true) {
                return {
                    label: 'Finishing',
                    labelClass: 'finishing',
                    buttonsForCards: [ButtonTypes[ButtonTypeEnum.VALIDATE_FUNDRAISING], LEARN_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE([ButtonTypes[ButtonTypeEnum.VALIDATE_FUNDRAISING]]),
                    buttonsForDetails: MANAGE([ButtonTypes[ButtonTypeEnum.VALIDATE_FUNDRAISING], UTXO], [], true),
                };
            } else {
                return {
                    label: 'Finishing',
                    labelClass: 'finishing',
                    buttonsForCards: [LEARN],
                    buttonsForHeader: [CONTACT],
                    buttonsForDetails: [CONTACT],
                };
            }

        case CampaignStatus_Code_Id_Enums.FAILED:
            if (isProtocolTeam === true) {
                return {
                    label: 'Failed',
                    labelClass: 'failed',
                    buttonsForCards: [ButtonTypes[ButtonTypeEnum.WITHDRAW_FAILED], LEARN_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE_OR_SAVE([ButtonTypes[ButtonTypeEnum.WITHDRAW_FAILED]]),
                    buttonsForDetails: MANAGE_EDIT_OR_SAVE([ButtonTypes[ButtonTypeEnum.WITHDRAW_FAILED], ...FOR_PROTOCOL_UTXOS_ARCHIVE_AND_DELETE]),
                };
            } else if (isAdmin === true) {
                return {
                    label: 'Failed',
                    labelClass: 'failed',
                    buttonsForCards: [ButtonTypes[ButtonTypeEnum.WITHDRAW_FAILED], LEARN_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE([ButtonTypes[ButtonTypeEnum.WITHDRAW_FAILED]]),
                    buttonsForDetails: MANAGE([ButtonTypes[ButtonTypeEnum.WITHDRAW_FAILED], UTXO], [], true),
                };
            } else {
                return {
                    label: 'Failed',
                    labelClass: 'failed',
                    buttonsForCards: [ButtonTypes[ButtonTypeEnum.GETBACK_FAILED], LEARN],
                    buttonsForHeader: [ButtonTypes[ButtonTypeEnum.GETBACK_FAILED]],
                    buttonsForDetails: [ButtonTypes[ButtonTypeEnum.GETBACK_FAILED], CONTACT],
                };
            }

        case CampaignStatus_Code_Id_Enums.UNREACHED:
            if (isProtocolTeam === true) {
                return {
                    label: 'Failed',
                    labelClass: 'failed',
                    buttonsForCards: [ButtonTypes[ButtonTypeEnum.WITHDRAW_UNREACHED], LEARN_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE_OR_SAVE([ButtonTypes[ButtonTypeEnum.WITHDRAW_UNREACHED]]),
                    buttonsForDetails: MANAGE_EDIT_OR_SAVE([ButtonTypes[ButtonTypeEnum.WITHDRAW_UNREACHED], ...FOR_PROTOCOL_UTXOS_ARCHIVE_AND_DELETE]),
                };
            } else if (isAdmin === true) {
                return {
                    label: 'Failed',
                    labelClass: 'failed',
                    buttonsForCards: [ButtonTypes[ButtonTypeEnum.WITHDRAW_UNREACHED], LEARN_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE([ButtonTypes[ButtonTypeEnum.WITHDRAW_UNREACHED]]),
                    buttonsForDetails: MANAGE([ButtonTypes[ButtonTypeEnum.WITHDRAW_UNREACHED], UTXO], [], true),
                };
            } else {
                return {
                    label: 'Failed',
                    labelClass: 'failed',
                    buttonsForCards: [ButtonTypes[ButtonTypeEnum.GETBACK_UNREACHED], LEARN],
                    buttonsForHeader: [ButtonTypes[ButtonTypeEnum.GETBACK_UNREACHED]],
                    buttonsForDetails: [ButtonTypes[ButtonTypeEnum.GETBACK_UNREACHED], CONTACT],
                };
            }

        case CampaignStatus_Code_Id_Enums.ACTIVE:
            if (totalMilestones === 0 || currentMilestoneIndex === undefined || milestone_status_code_id === undefined) {
                throw new Error('Milestone status code_id is required');
            }
            if (isProtocolTeam === true || isAdmin === true) {
                return milestoneConfig(isProtocolTeam, isAdmin, isEditor, isEditMode, campaignViewFor, totalMilestones, currentMilestoneIndex, milestone_status_code_id);
            } else {
                return {
                    label: `Active ${currentMilestoneIndex + 1}/${totalMilestones}`,
                    labelClass: 'active',
                    buttonsForCards: [ButtonTypes[ButtonTypeEnum.VIEW_MILESTONES], LEARN],
                    buttonsForHeader: [CONTACT],
                    buttonsForDetails: [CONTACT],
                };
            }

        case CampaignStatus_Code_Id_Enums.SUCCESS:
            if (isProtocolTeam === true) {
                return {
                    label: 'Success',
                    labelClass: 'success',
                    buttonsForCards: [LEARN_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE_EDIT_OR_SAVE([]),
                    buttonsForDetails: MANAGE_EDIT_OR_SAVE(FOR_PROTOCOL_UTXOS_ARCHIVE_AND_DELETE),
                };
            } else if (isAdmin === true) {
                return {
                    label: 'Success',
                    labelClass: 'success',
                    buttonsForCards: [LEARN_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE([UTXO]),
                    buttonsForDetails: MANAGE([UTXO], [], true),
                };
            } else {
                return {
                    label: 'Success',
                    labelClass: 'success',
                    buttonsForCards: [LEARN],
                    buttonsForHeader: [CONTACT],
                    buttonsForDetails: [CONTACT],
                };
            }
    }

    throw new Error(`No Info found for code_id: ${campaign_status_code_id}`);
};

export const milestoneConfig = (
    isProtocolTeam: boolean,
    isAdmin: boolean,
    isEditor: boolean,
    isEditMode: boolean,
    campaignViewFor: CampaignViewForEnums,
    totalMilestones: number,
    currentMilestoneIndex: number,
    milestone_status_code_id: number
): CampaignStatusConfig => {
    const isManagePage = campaignViewFor === CampaignViewForEnums.manage;

    const MANAGE_EDIT_OR_SAVE = (buttonsInManageAndNotInEditMode: ButtonType[], buttonsNotInManage: ButtonType[] = [], swAddContact: boolean = false) => {
        return isManagePage === false
            ? [ButtonTypes[ButtonTypeEnum.MANAGE_CAMPAIGN_FOR_DETAILS], ...buttonsNotInManage, ...(swAddContact === true ? [CONTACT] : [])]
            : isEditMode === false
            ? [
                  ButtonTypes[ButtonTypeEnum.RENDER_CAMPAIGN_FOR_MANAGE],
                  ButtonTypes[ButtonTypeEnum.EDIT_CAMPAIGN],
                  ...buttonsInManageAndNotInEditMode,
                  ...(swAddContact === true ? [CONTACT] : []),
              ]
            : [ButtonTypes[ButtonTypeEnum.SAVE_CAMPAIGN]];
    };

    const MANAGE_OR_SAVE = (buttonsInManageAndNotInEditMode: ButtonType[], buttonsNotInManage: ButtonType[] = [], swAddContact: boolean = false) => {
        return isManagePage === false
            ? [ButtonTypes[ButtonTypeEnum.MANAGE_CAMPAIGN_FOR_DETAILS], ...buttonsNotInManage, ...(swAddContact === true ? [CONTACT] : [])]
            : isEditMode === false
            ? [ButtonTypes[ButtonTypeEnum.RENDER_CAMPAIGN_FOR_MANAGE], ...buttonsInManageAndNotInEditMode, ...(swAddContact === true ? [CONTACT] : [])]
            : [ButtonTypes[ButtonTypeEnum.SAVE_CAMPAIGN]];
    };

    const MANAGE = (buttonsInManageAndNotInEditMode: ButtonType[], buttonsNotInManage: ButtonType[] = [], swAddContact: boolean = false) => {
        return isManagePage === false
            ? [ButtonTypes[ButtonTypeEnum.MANAGE_CAMPAIGN_FOR_DETAILS], ...buttonsNotInManage, ...(swAddContact === true ? [CONTACT] : [])]
            : [ButtonTypes[ButtonTypeEnum.RENDER_CAMPAIGN_FOR_MANAGE], ...buttonsInManageAndNotInEditMode, ...(swAddContact === true ? [CONTACT] : [])];
    };

    const VIEW_OR_MANAGE_FOR_CARDS = isManagePage === false ? ButtonTypes[ButtonTypeEnum.VIEW_CAMPAIGN] : ButtonTypes[ButtonTypeEnum.MANAGE_CAMPAIGN_FOR_DETAILS];
    const LEARN_OR_MANAGE_FOR_CARDS = isManagePage === false ? ButtonTypes[ButtonTypeEnum.LEARN_MORE] : ButtonTypes[ButtonTypeEnum.MANAGE_CAMPAIGN_FOR_DETAILS];

    const LEARN = ButtonTypes[ButtonTypeEnum.LEARN_MORE];
    const CONTACT = ButtonTypes[ButtonTypeEnum.CONTACT_TEAM_SUPPORT];
    const UTXO = ButtonTypes[ButtonTypeEnum.MANAGE_CAMPAIGN_UTXOS];

    const FOR_PROTOCOL_ARCHIVE_AND_DELETE = [
        ButtonTypes[ButtonTypeEnum.FEATURE_CAMPAIGN],
        ButtonTypes[ButtonTypeEnum.ARCHIVE_CAMPAIGN],
        ButtonTypes[ButtonTypeEnum.DELETE_CAMPAIGN],
    ];
    const FOR_PROTOCOL_UTXOS_ARCHIVE_AND_DELETE = [
        ButtonTypes[ButtonTypeEnum.MANAGE_CAMPAIGN_UTXOS],
        ButtonTypes[ButtonTypeEnum.FEATURE_CAMPAIGN],
        ButtonTypes[ButtonTypeEnum.ARCHIVE_CAMPAIGN],
        ButtonTypes[ButtonTypeEnum.DELETE_CAMPAIGN],
    ];

    switch (milestone_status_code_id) {
        case MilestoneStatus_Code_Id_Enums.NOT_STARTED:
            if (isProtocolTeam === true) {
                return {
                    label: `Active ${currentMilestoneIndex + 1}/${totalMilestones}`,
                    labelClass: 'active',
                    buttonsForCards: [ButtonTypes[ButtonTypeEnum.VIEW_MILESTONES], LEARN_OR_MANAGE_FOR_CARDS],
                    buttonsForHeader: MANAGE_EDIT_OR_SAVE([]),
                    buttonsForDetails: MANAGE_EDIT_OR_SAVE([...FOR_PROTOCOL_UTXOS_ARCHIVE_AND_DELETE]),
                };
            } else if (isAdmin === true) {
                return {
                    label: `Active ${currentMilestoneIndex + 1}/${totalMilestones}`,
                    labelClass: 'active',
                    buttonsForCards: [ButtonTypes[ButtonTypeEnum.VIEW_MILESTONES], LEARN_OR_MANAGE_FOR_CARDS],
                    buttonsForHeader: MANAGE([UTXO]),
                    buttonsForDetails: MANAGE([UTXO], [], true),
                };
            } else if (isEditor === true) {
                return {
                    label: `Active ${currentMilestoneIndex + 1}/${totalMilestones}`,
                    labelClass: 'active',
                    buttonsForCards: [ButtonTypes[ButtonTypeEnum.VIEW_MILESTONES], LEARN],
                    buttonsForHeader: [CONTACT],
                    buttonsForDetails: [CONTACT],
                };
            }
        case MilestoneStatus_Code_Id_Enums.STARTED:
            if (isProtocolTeam === true) {
                return {
                    label: `Active ${currentMilestoneIndex + 1}/${totalMilestones}`,
                    labelClass: 'active',
                    buttonsForCards: [ButtonTypes[ButtonTypeEnum.SUBMIT_MILESTONE], LEARN_OR_MANAGE_FOR_CARDS],
                    buttonsForHeader: MANAGE_OR_SAVE([ButtonTypes[ButtonTypeEnum.SUBMIT_MILESTONE]]),
                    buttonsForDetails: MANAGE_EDIT_OR_SAVE([ButtonTypes[ButtonTypeEnum.SUBMIT_MILESTONE], ...FOR_PROTOCOL_UTXOS_ARCHIVE_AND_DELETE]),
                };
            } else if (isAdmin === true) {
                return {
                    label: `Active ${currentMilestoneIndex + 1}/${totalMilestones}`,
                    labelClass: 'active',
                    buttonsForCards: [ButtonTypes[ButtonTypeEnum.SUBMIT_MILESTONE], LEARN_OR_MANAGE_FOR_CARDS],
                    buttonsForHeader: MANAGE([ButtonTypes[ButtonTypeEnum.SUBMIT_MILESTONE]]),
                    buttonsForDetails: MANAGE([ButtonTypes[ButtonTypeEnum.SUBMIT_MILESTONE], UTXO], [], true),
                };
            } else if (isEditor === true) {
                return {
                    label: `Active ${currentMilestoneIndex + 1}/${totalMilestones}`,
                    labelClass: 'active',
                    buttonsForCards: [ButtonTypes[ButtonTypeEnum.SUBMIT_MILESTONE], LEARN_OR_MANAGE_FOR_CARDS],
                    buttonsForHeader: MANAGE([ButtonTypes[ButtonTypeEnum.SUBMIT_MILESTONE]]),
                    buttonsForDetails: MANAGE([ButtonTypes[ButtonTypeEnum.SUBMIT_MILESTONE]], [], true),
                };
            }
        case MilestoneStatus_Code_Id_Enums.SUBMITTED:
            if (isProtocolTeam === true) {
                return {
                    label: `Active ${currentMilestoneIndex + 1}/${totalMilestones}`,
                    labelClass: 'active',
                    buttonsForCards: [ButtonTypes[ButtonTypeEnum.MANAGE_MILESTONE_SUBMISSIONS], LEARN_OR_MANAGE_FOR_CARDS],
                    buttonsForHeader: MANAGE_OR_SAVE([ButtonTypes[ButtonTypeEnum.MANAGE_MILESTONE_SUBMISSIONS]]),
                    buttonsForDetails: MANAGE_EDIT_OR_SAVE([
                        ButtonTypes[ButtonTypeEnum.MANAGE_MILESTONE_SUBMISSIONS],
                        ButtonTypes[ButtonTypeEnum.VIEW_MILESTONE_SUBMISSIONS],
                        ...FOR_PROTOCOL_UTXOS_ARCHIVE_AND_DELETE,
                    ]),
                };
            } else if (isAdmin === true) {
                return {
                    label: `Active ${currentMilestoneIndex + 1}/${totalMilestones}`,
                    labelClass: 'active',
                    buttonsForCards: [ButtonTypes[ButtonTypeEnum.VIEW_CAMPAIGN_SUBMISSIONS], LEARN_OR_MANAGE_FOR_CARDS],
                    buttonsForHeader: MANAGE([ButtonTypes[ButtonTypeEnum.VIEW_CAMPAIGN_SUBMISSIONS]]),
                    buttonsForDetails: MANAGE([ButtonTypes[ButtonTypeEnum.VIEW_CAMPAIGN_SUBMISSIONS], UTXO], [], true),
                };
            } else if (isEditor === true) {
                return {
                    label: `Active ${currentMilestoneIndex + 1}/${totalMilestones}`,
                    labelClass: 'active',
                    buttonsForCards: [ButtonTypes[ButtonTypeEnum.VIEW_CAMPAIGN_SUBMISSIONS], LEARN_OR_MANAGE_FOR_CARDS],
                    buttonsForHeader: MANAGE([ButtonTypes[ButtonTypeEnum.VIEW_CAMPAIGN_SUBMISSIONS]]),
                    buttonsForDetails: MANAGE([ButtonTypes[ButtonTypeEnum.VIEW_CAMPAIGN_SUBMISSIONS]], [], true),
                };
            }
        case MilestoneStatus_Code_Id_Enums.REJECTED:
            if (isProtocolTeam === true) {
                return {
                    label: `Active ${currentMilestoneIndex + 1}/${totalMilestones}`,
                    labelClass: 'active',
                    buttonsForCards: [ButtonTypes[ButtonTypeEnum.VIEW_MILESTONE_SUBMISSIONS], LEARN_OR_MANAGE_FOR_CARDS],
                    buttonsForHeader: MANAGE_OR_SAVE([ButtonTypes[ButtonTypeEnum.VIEW_MILESTONE_SUBMISSIONS]]),
                    buttonsForDetails: MANAGE_EDIT_OR_SAVE([
                        ButtonTypes[ButtonTypeEnum.VIEW_MILESTONE_SUBMISSIONS],
                        ButtonTypes[ButtonTypeEnum.SUBMIT_MILESTONE],
                        ...FOR_PROTOCOL_UTXOS_ARCHIVE_AND_DELETE,
                    ]),
                };
            } else if (isAdmin === true) {
                return {
                    label: `Active ${currentMilestoneIndex + 1}/${totalMilestones}`,
                    labelClass: 'active',
                    buttonsForCards: [ButtonTypes[ButtonTypeEnum.VIEW_MILESTONE_SUBMISSIONS], LEARN_OR_MANAGE_FOR_CARDS],
                    buttonsForHeader: MANAGE([ButtonTypes[ButtonTypeEnum.VIEW_MILESTONE_SUBMISSIONS]]),
                    buttonsForDetails: MANAGE([ButtonTypes[ButtonTypeEnum.VIEW_MILESTONE_SUBMISSIONS], ButtonTypes[ButtonTypeEnum.SUBMIT_MILESTONE], UTXO], [], true),
                };
            } else if (isEditor === true) {
                return {
                    label: `Active ${currentMilestoneIndex + 1}/${totalMilestones}`,
                    labelClass: 'active',
                    buttonsForCards: [ButtonTypes[ButtonTypeEnum.VIEW_MILESTONE_SUBMISSIONS], LEARN_OR_MANAGE_FOR_CARDS],
                    buttonsForHeader: MANAGE([ButtonTypes[ButtonTypeEnum.VIEW_MILESTONE_SUBMISSIONS]], [], true),
                    buttonsForDetails: MANAGE([ButtonTypes[ButtonTypeEnum.VIEW_MILESTONE_SUBMISSIONS], ButtonTypes[ButtonTypeEnum.SUBMIT_MILESTONE]], [], true),
                };
            }
        case MilestoneStatus_Code_Id_Enums.COLLECT:
            if (isProtocolTeam === true) {
                return {
                    label: `Active ${currentMilestoneIndex + 1}/${totalMilestones}`,
                    labelClass: 'active',
                    buttonsForCards: [LEARN_OR_MANAGE_FOR_CARDS],
                    buttonsForHeader: MANAGE_OR_SAVE([ButtonTypes[ButtonTypeEnum.VIEW_MILESTONE_SUBMISSIONS]]),
                    buttonsForDetails: MANAGE_EDIT_OR_SAVE([ButtonTypes[ButtonTypeEnum.VIEW_MILESTONE_SUBMISSIONS], ...FOR_PROTOCOL_UTXOS_ARCHIVE_AND_DELETE]),
                };
            } else if (isAdmin === true) {
                return {
                    label: `Active ${currentMilestoneIndex + 1}/${totalMilestones}`,
                    labelClass: 'active',
                    buttonsForCards: [ButtonTypes[ButtonTypeEnum.COLLECT_MILESTONE], LEARN_OR_MANAGE_FOR_CARDS],
                    buttonsForHeader: MANAGE([ButtonTypes[ButtonTypeEnum.COLLECT_MILESTONE]]),
                    buttonsForDetails: MANAGE([ButtonTypes[ButtonTypeEnum.COLLECT_MILESTONE], ButtonTypes[ButtonTypeEnum.VIEW_MILESTONE_SUBMISSIONS], UTXO], [], true),
                };
            } else if (isEditor === true) {
                return {
                    label: `Active ${currentMilestoneIndex + 1}/${totalMilestones}`,
                    labelClass: 'active',
                    buttonsForCards: [ButtonTypes[ButtonTypeEnum.VIEW_MILESTONE_SUBMISSIONS], LEARN_OR_MANAGE_FOR_CARDS],
                    buttonsForHeader: MANAGE([ButtonTypes[ButtonTypeEnum.VIEW_MILESTONE_SUBMISSIONS]], [], true),
                    buttonsForDetails: MANAGE([ButtonTypes[ButtonTypeEnum.VIEW_MILESTONE_SUBMISSIONS]], [], true),
                };
            }
        case MilestoneStatus_Code_Id_Enums.FAILED:
            // nunca se muestra este estado, por que toda la campaña pasa a Failed
            return {
                label: `Failed ${currentMilestoneIndex + 1}/${totalMilestones}`,
                labelClass: 'active',
                buttonsForCards: [],
                buttonsForHeader: [],
                buttonsForDetails: [],
            };
        default:
            throw new Error(`No Info found for milestone_status_code_id: ${milestone_status_code_id}`);
    }
};
