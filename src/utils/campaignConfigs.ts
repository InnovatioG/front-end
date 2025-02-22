import { CampaignEX } from '@/types/types';
import { PageViewEnums } from './constants/routes';
import { ButtonType, ButtonForDetails, ButtonsForDetailsEnum, ButtonForCards, ButtonsForCardsEnum } from './constants/buttons';
import { CampaignStatus_Code_Id_Enums, MilestoneStatus_Code_Id_Enums } from './constants/status/status';
import { toJson } from 'smart-db';

export interface CampaignStatusConfigs {
    label: string;
    labelClass: string;
    buttonsForCards: ButtonType[];
    buttonsForHeader: ButtonType[];
    buttonsForDetails: ButtonType[];
}

export const campaignStatusConfigs = (
    campaign: CampaignEX,
    isProtocolTeam: boolean,
    isAdmin: boolean,
    isEditor: boolean,
    isEditMode: boolean,
    isValidEdit: boolean,
    pageView: PageViewEnums,
    campaign_status_code_id: number,
    totalMilestones: number,
    currentMilestoneIndex?: number,
    milestone_status_code_id?: number
): CampaignStatusConfigs => {
    const isManagePage = pageView === PageViewEnums.MANAGE;

    const MANAGE_EDIT_OR_SAVE = (buttonsInManageAndNotInEditMode: ButtonType[], buttonsNotInManage: ButtonType[] = [], swAddContact: boolean = false) => {
        return isManagePage === false
            ? [ButtonForDetails[ButtonsForDetailsEnum.MANAGE_CAMPAIGN], ...buttonsNotInManage, ...(swAddContact === true ? [CONTACT] : [])]
            : isEditMode === false
            ? [
                  ButtonForDetails[ButtonsForDetailsEnum.RENDER_CAMPAIGN_FOR_MANAGE],
                  ButtonForDetails[ButtonsForDetailsEnum.EDIT_CAMPAIGN],
                  ...buttonsInManageAndNotInEditMode,
                  ...(swAddContact === true ? [CONTACT] : []),
              ]
            : [ButtonForDetails[ButtonsForDetailsEnum.CANCEL_EDIT_CAMPAIGN], isValidEdit ? ButtonForDetails[ButtonsForDetailsEnum.SAVE_CAMPAIGN] : ButtonForDetails[ButtonsForDetailsEnum.SAVE_DISABLED_CAMPAIGN]];
    };

    const MANAGE_OR_SAVE = (buttonsInManageAndNotInEditMode: ButtonType[], buttonsNotInManage: ButtonType[] = [], swAddContact: boolean = false) => {
        return isManagePage === false
            ? [ButtonForDetails[ButtonsForDetailsEnum.MANAGE_CAMPAIGN], ...buttonsNotInManage, ...(swAddContact === true ? [CONTACT] : [])]
            : isEditMode === false
            ? [ButtonForDetails[ButtonsForDetailsEnum.RENDER_CAMPAIGN_FOR_MANAGE], ...buttonsInManageAndNotInEditMode, ...(swAddContact === true ? [CONTACT] : [])]
            : [ButtonForDetails[ButtonsForDetailsEnum.CANCEL_EDIT_CAMPAIGN], isValidEdit ? ButtonForDetails[ButtonsForDetailsEnum.SAVE_CAMPAIGN] : ButtonForDetails[ButtonsForDetailsEnum.SAVE_DISABLED_CAMPAIGN]];
    };

    const MANAGE = (buttonsInManageAndNotInEditMode: ButtonType[], buttonsNotInManage: ButtonType[] = [], swAddContact: boolean = false) => {
        return isManagePage === false
            ? [ButtonForDetails[ButtonsForDetailsEnum.MANAGE_CAMPAIGN], ...buttonsNotInManage, ...(swAddContact === true ? [CONTACT] : [])]
            : [ButtonForDetails[ButtonsForDetailsEnum.RENDER_CAMPAIGN_FOR_MANAGE], ...buttonsInManageAndNotInEditMode, ...(swAddContact === true ? [CONTACT] : [])];
    };

    const VIEW_OR_MANAGE_FOR_CARD = isManagePage === false ? ButtonForCards[ButtonsForCardsEnum.VIEW_CAMPAIGN] : ButtonForCards[ButtonsForCardsEnum.MANAGE_CAMPAIGN];
    const LEARN_OR_MANAGE_FOR_CARD = isManagePage === false ? ButtonForCards[ButtonsForCardsEnum.LEARN_MORE] : ButtonForCards[ButtonsForCardsEnum.MANAGE_CAMPAIGN];

    const LEARN_FOR_CARD = ButtonForCards[ButtonsForCardsEnum.LEARN_MORE];

    const CONTACT = ButtonForDetails[ButtonsForDetailsEnum.CONTACT_TEAM_SUPPORT];
    const UTXO = ButtonForDetails[ButtonsForDetailsEnum.MANAGE_CAMPAIGN_UTXOS];

    const FOR_PROTOCOL_ARCHIVE_AND_DELETE = [
        campaign.campaign.featured === false ? ButtonForDetails[ButtonsForDetailsEnum.FEATURE_CAMPAIGN] : ButtonForDetails[ButtonsForDetailsEnum.UNFEATURE_CAMPAIGN],
        campaign.campaign.archived === false ? ButtonForDetails[ButtonsForDetailsEnum.ARCHIVE_CAMPAIGN] : ButtonForDetails[ButtonsForDetailsEnum.UNARCHIVE_CAMPAIGN],
        ButtonForDetails[ButtonsForDetailsEnum.DELETE_CAMPAIGN],
    ];
    const FOR_PROTOCOL_UTXOS_ARCHIVE_AND_DELETE = [
        ButtonForDetails[ButtonsForDetailsEnum.MANAGE_CAMPAIGN_UTXOS],
        campaign.campaign.featured === false ? ButtonForDetails[ButtonsForDetailsEnum.FEATURE_CAMPAIGN] : ButtonForDetails[ButtonsForDetailsEnum.UNFEATURE_CAMPAIGN],
        campaign.campaign.archived === false ? ButtonForDetails[ButtonsForDetailsEnum.ARCHIVE_CAMPAIGN] : ButtonForDetails[ButtonsForDetailsEnum.UNARCHIVE_CAMPAIGN],
        ButtonForDetails[ButtonsForDetailsEnum.DELETE_CAMPAIGN],
    ];

    switch (campaign_status_code_id) {
        case CampaignStatus_Code_Id_Enums.NOT_STARTED:
            return {
                label: 'Draft',
                labelClass: 'draft',
                buttonsForCards: [],
                buttonsForHeader: [],
                buttonsForDetails: [],
            };
        case CampaignStatus_Code_Id_Enums.CREATED:
            if (isProtocolTeam === true) {
                return {
                    label: 'Draft',
                    labelClass: 'draft',
                    buttonsForCards: [ButtonForCards[ButtonsForCardsEnum.SUBMIT_CAMPAIGN], VIEW_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE_OR_SAVE([ButtonForDetails[ButtonsForDetailsEnum.SUBMIT_CAMPAIGN]]),
                    buttonsForDetails: MANAGE_EDIT_OR_SAVE([ButtonForDetails[ButtonsForDetailsEnum.SUBMIT_CAMPAIGN], ...FOR_PROTOCOL_ARCHIVE_AND_DELETE]),
                };
            } else if (isAdmin === true) {
                return {
                    label: 'Draft',
                    labelClass: 'draft',
                    buttonsForCards: [ButtonForCards[ButtonsForCardsEnum.SUBMIT_CAMPAIGN], VIEW_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE_OR_SAVE([ButtonForDetails[ButtonsForDetailsEnum.SUBMIT_CAMPAIGN]]),
                    buttonsForDetails: MANAGE_EDIT_OR_SAVE(
                        [ButtonForDetails[ButtonsForDetailsEnum.SUBMIT_CAMPAIGN], ButtonForDetails[ButtonsForDetailsEnum.DELETE_CAMPAIGN]],
                        [],
                        true
                    ),
                };
            } else if (isEditor === true) {
                return {
                    label: 'Draft',
                    labelClass: 'draft',
                    buttonsForCards: [ButtonForCards[ButtonsForCardsEnum.SUBMIT_CAMPAIGN], VIEW_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE_OR_SAVE([ButtonForDetails[ButtonsForDetailsEnum.SUBMIT_CAMPAIGN]]),
                    buttonsForDetails: MANAGE_EDIT_OR_SAVE([ButtonForDetails[ButtonsForDetailsEnum.SUBMIT_CAMPAIGN]], [], true),
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
                    buttonsForCards: [ButtonForCards[ButtonsForCardsEnum.MANAGE_CAMPAIGN_SUBMISSIONS], VIEW_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE_OR_SAVE([ButtonForDetails[ButtonsForDetailsEnum.MANAGE_CAMPAIGN_SUBMISSIONS]]),
                    buttonsForDetails: MANAGE_EDIT_OR_SAVE([
                        ButtonForDetails[ButtonsForDetailsEnum.MANAGE_CAMPAIGN_SUBMISSIONS],
                        ButtonForDetails[ButtonsForDetailsEnum.VIEW_CAMPAIGN_SUBMISSIONS],
                        ...FOR_PROTOCOL_ARCHIVE_AND_DELETE,
                    ]),
                };
            } else if (isAdmin === true) {
                return {
                    label: 'Submitted',
                    labelClass: 'submitted',
                    buttonsForCards: [ButtonForCards[ButtonsForCardsEnum.VIEW_CAMPAIGN_SUBMISSIONS], VIEW_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE([ButtonForDetails[ButtonsForDetailsEnum.VIEW_CAMPAIGN_SUBMISSIONS]]),
                    buttonsForDetails: MANAGE([ButtonForDetails[ButtonsForDetailsEnum.VIEW_CAMPAIGN_SUBMISSIONS]], [], true),
                };
            } else if (isEditor === true) {
                return {
                    label: 'Submitted',
                    labelClass: 'submitted',
                    buttonsForCards: [ButtonForCards[ButtonsForCardsEnum.VIEW_CAMPAIGN_SUBMISSIONS], VIEW_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE([ButtonForDetails[ButtonsForDetailsEnum.VIEW_CAMPAIGN_SUBMISSIONS]]),
                    buttonsForDetails: MANAGE([ButtonForDetails[ButtonsForDetailsEnum.VIEW_CAMPAIGN_SUBMISSIONS]], [], true),
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
                    buttonsForCards: [ButtonForCards[ButtonsForCardsEnum.VIEW_CAMPAIGN_SUBMISSIONS], VIEW_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE_OR_SAVE([ButtonForDetails[ButtonsForDetailsEnum.VIEW_CAMPAIGN_SUBMISSIONS]]),
                    buttonsForDetails: MANAGE_EDIT_OR_SAVE([
                        ButtonForDetails[ButtonsForDetailsEnum.VIEW_CAMPAIGN_SUBMISSIONS],
                        ButtonForDetails[ButtonsForDetailsEnum.SUBMIT_CAMPAIGN],
                        ...FOR_PROTOCOL_ARCHIVE_AND_DELETE,
                    ]),
                };
            } else if (isAdmin === true) {
                return {
                    label: 'Rejected',
                    labelClass: 'rejected',
                    buttonsForCards: [ButtonForCards[ButtonsForCardsEnum.VIEW_CAMPAIGN_SUBMISSIONS], VIEW_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE_OR_SAVE([ButtonForDetails[ButtonsForDetailsEnum.VIEW_CAMPAIGN_SUBMISSIONS]]),
                    buttonsForDetails: MANAGE_EDIT_OR_SAVE(
                        [
                            ButtonForDetails[ButtonsForDetailsEnum.VIEW_CAMPAIGN_SUBMISSIONS],
                            ButtonForDetails[ButtonsForDetailsEnum.SUBMIT_CAMPAIGN],
                            ButtonForDetails[ButtonsForDetailsEnum.DELETE_CAMPAIGN],
                        ],
                        [],
                        true
                    ),
                };
            } else if (isEditor === true) {
                return {
                    label: 'Rejected',
                    labelClass: 'rejected',
                    buttonsForCards: [ButtonForCards[ButtonsForCardsEnum.VIEW_CAMPAIGN_SUBMISSIONS], VIEW_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE_OR_SAVE([ButtonForDetails[ButtonsForDetailsEnum.VIEW_CAMPAIGN_SUBMISSIONS]]),
                    buttonsForDetails: MANAGE_EDIT_OR_SAVE(
                        [ButtonForDetails[ButtonsForDetailsEnum.VIEW_CAMPAIGN_SUBMISSIONS], ButtonForDetails[ButtonsForDetailsEnum.SUBMIT_CAMPAIGN]],
                        [],
                        true
                    ),
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
                    buttonsForCards: [ButtonForCards[ButtonsForCardsEnum.CREATE_CONTRACTS], VIEW_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE_OR_SAVE([ButtonForDetails[ButtonsForDetailsEnum.CREATE_CONTRACTS]]),
                    buttonsForDetails: MANAGE_EDIT_OR_SAVE([
                        ButtonForDetails[ButtonsForDetailsEnum.CREATE_CONTRACTS],
                        ButtonForDetails[ButtonsForDetailsEnum.VIEW_CAMPAIGN_SUBMISSIONS],
                        ...FOR_PROTOCOL_ARCHIVE_AND_DELETE,
                    ]),
                };
            } else if (isAdmin === true) {
                return {
                    label: 'Approved',
                    labelClass: 'approved',
                    buttonsForCards: [ButtonForCards[ButtonsForCardsEnum.VIEW_CAMPAIGN_SUBMISSIONS], VIEW_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE([ButtonForDetails[ButtonsForDetailsEnum.VIEW_CAMPAIGN_SUBMISSIONS]]),
                    buttonsForDetails: MANAGE([ButtonForDetails[ButtonsForDetailsEnum.VIEW_CAMPAIGN_SUBMISSIONS]], [], true),
                };
            } else if (isEditor === true) {
                return {
                    label: 'Approved',
                    labelClass: 'approved',
                    buttonsForCards: [ButtonForCards[ButtonsForCardsEnum.VIEW_CAMPAIGN_SUBMISSIONS], VIEW_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE([ButtonForDetails[ButtonsForDetailsEnum.VIEW_CAMPAIGN_SUBMISSIONS]]),
                    buttonsForDetails: MANAGE([ButtonForDetails[ButtonsForDetailsEnum.VIEW_CAMPAIGN_SUBMISSIONS]], [], true),
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
                    buttonsForCards: [ButtonForCards[ButtonsForCardsEnum.PUBLISH_CONTRACTS], VIEW_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE_OR_SAVE([ButtonForDetails[ButtonsForDetailsEnum.PUBLISH_CONTRACTS]]),
                    buttonsForDetails: MANAGE_EDIT_OR_SAVE([ButtonForDetails[ButtonsForDetailsEnum.PUBLISH_CONTRACTS], ...FOR_PROTOCOL_ARCHIVE_AND_DELETE]),
                };
            } else if (isAdmin === true) {
                return {
                    label: 'Created',
                    labelClass: 'created',
                    buttonsForCards: [ButtonForCards[ButtonsForCardsEnum.VIEW_CAMPAIGN_SUBMISSIONS], VIEW_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE([ButtonForDetails[ButtonsForDetailsEnum.VIEW_CAMPAIGN_SUBMISSIONS]]),
                    buttonsForDetails: MANAGE([ButtonForDetails[ButtonsForDetailsEnum.VIEW_CAMPAIGN_SUBMISSIONS]], [], true),
                };
            } else if (isEditor === true) {
                return {
                    label: 'Created',
                    labelClass: 'created',
                    buttonsForCards: [ButtonForCards[ButtonsForCardsEnum.VIEW_CAMPAIGN_SUBMISSIONS], VIEW_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE([ButtonForDetails[ButtonsForDetailsEnum.VIEW_CAMPAIGN_SUBMISSIONS]]),
                    buttonsForDetails: MANAGE([ButtonForDetails[ButtonsForDetailsEnum.VIEW_CAMPAIGN_SUBMISSIONS]], [], true),
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
                    buttonsForCards: [ButtonForCards[ButtonsForCardsEnum.INITIALIZE_CAMPAIGN], VIEW_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE_OR_SAVE([ButtonForDetails[ButtonsForDetailsEnum.INITIALIZE_CAMPAIGN]]),
                    buttonsForDetails: MANAGE_EDIT_OR_SAVE([ButtonForDetails[ButtonsForDetailsEnum.INITIALIZE_CAMPAIGN], ...FOR_PROTOCOL_ARCHIVE_AND_DELETE]),
                };
            } else if (isAdmin === true) {
                return {
                    label: 'Deploy',
                    labelClass: 'deploy',
                    buttonsForCards: [ButtonForCards[ButtonsForCardsEnum.VIEW_CAMPAIGN_SUBMISSIONS], VIEW_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE([ButtonForDetails[ButtonsForDetailsEnum.VIEW_CAMPAIGN_SUBMISSIONS]]),
                    buttonsForDetails: MANAGE([ButtonForDetails[ButtonsForDetailsEnum.VIEW_CAMPAIGN_SUBMISSIONS]], [], true),
                };
            } else if (isEditor === true) {
                return {
                    label: 'Deploy',
                    labelClass: 'deploy',
                    buttonsForCards: [ButtonForCards[ButtonsForCardsEnum.VIEW_CAMPAIGN_SUBMISSIONS], VIEW_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE([ButtonForDetails[ButtonsForDetailsEnum.VIEW_CAMPAIGN_SUBMISSIONS]]),
                    buttonsForDetails: MANAGE([ButtonForDetails[ButtonsForDetailsEnum.VIEW_CAMPAIGN_SUBMISSIONS]], [], true),
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
                    buttonsForCards: [ButtonForCards[ButtonsForCardsEnum.LAUNCH_CAMPAIGN], VIEW_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE_OR_SAVE([ButtonForDetails[ButtonsForDetailsEnum.LAUNCH_CAMPAIGN]]),
                    buttonsForDetails: MANAGE_EDIT_OR_SAVE([ButtonForDetails[ButtonsForDetailsEnum.LAUNCH_CAMPAIGN], ...FOR_PROTOCOL_UTXOS_ARCHIVE_AND_DELETE]),
                };
            } else if (isAdmin === true) {
                return {
                    label: 'Ready',
                    labelClass: 'ready',
                    buttonsForCards: [ButtonForCards[ButtonsForCardsEnum.LAUNCH_CAMPAIGN], VIEW_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE([ButtonForDetails[ButtonsForDetailsEnum.LAUNCH_CAMPAIGN]]),
                    buttonsForDetails: MANAGE([ButtonForDetails[ButtonsForDetailsEnum.LAUNCH_CAMPAIGN], UTXO], [], true),
                };
            } else if (isEditor === true) {
                return {
                    label: 'Ready',
                    labelClass: 'ready',
                    buttonsForCards: [LEARN_FOR_CARD],
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
                    buttonsForCards: [ButtonForCards[ButtonsForCardsEnum.VIEW_MILESTONES], LEARN_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE_OR_SAVE([UTXO]),
                    buttonsForDetails: MANAGE_EDIT_OR_SAVE(FOR_PROTOCOL_UTXOS_ARCHIVE_AND_DELETE),
                };
            } else if (isAdmin === true) {
                return {
                    label: 'Countdown',
                    labelClass: 'countdown',
                    buttonsForCards: [ButtonForCards[ButtonsForCardsEnum.VIEW_MILESTONES], LEARN_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE([UTXO]),
                    buttonsForDetails: MANAGE([UTXO], [], true),
                };
            } else {
                return {
                    label: 'Countdown',
                    labelClass: 'countdown',
                    buttonsForCards: [ButtonForCards[ButtonsForCardsEnum.VIEW_MILESTONES], LEARN_FOR_CARD],
                    buttonsForHeader: [CONTACT],
                    buttonsForDetails: [CONTACT],
                };
            }

        case CampaignStatus_Code_Id_Enums.FUNDRAISING:
            if (isProtocolTeam === true) {
                return {
                    label: 'Fundraising',
                    labelClass: 'fundraising',
                    buttonsForCards: [ButtonForCards[ButtonsForCardsEnum.INVEST], LEARN_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE_OR_SAVE([UTXO], [ButtonForDetails[ButtonsForDetailsEnum.INVEST]]),
                    buttonsForDetails: MANAGE_EDIT_OR_SAVE(FOR_PROTOCOL_UTXOS_ARCHIVE_AND_DELETE, [ButtonForDetails[ButtonsForDetailsEnum.INVEST]]),
                };
            } else if (isAdmin === true) {
                return {
                    label: 'Fundraising',
                    labelClass: 'fundraising',
                    buttonsForCards: [ButtonForCards[ButtonsForCardsEnum.INVEST], LEARN_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE([UTXO], [ButtonForDetails[ButtonsForDetailsEnum.INVEST]]),
                    buttonsForDetails: MANAGE([UTXO], [ButtonForDetails[ButtonsForDetailsEnum.INVEST]], true),
                };
            } else {
                return {
                    label: 'Fundraising',
                    labelClass: 'fundraising',
                    buttonsForCards: [ButtonForCards[ButtonsForCardsEnum.INVEST], LEARN_FOR_CARD],
                    buttonsForHeader: [ButtonForDetails[ButtonsForDetailsEnum.INVEST]],
                    buttonsForDetails: [ButtonForDetails[ButtonsForDetailsEnum.INVEST], CONTACT],
                };
            }

        case CampaignStatus_Code_Id_Enums.FINISHING:
            if (isProtocolTeam === true) {
                return {
                    label: 'Finishing',
                    labelClass: 'finishing',
                    buttonsForCards: [ButtonForCards[ButtonsForCardsEnum.VALIDATE_FUNDRAISING], LEARN_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE_OR_SAVE([ButtonForDetails[ButtonsForDetailsEnum.VALIDATE_FUNDRAISING]]),
                    buttonsForDetails: MANAGE_EDIT_OR_SAVE([ButtonForDetails[ButtonsForDetailsEnum.VALIDATE_FUNDRAISING], ...FOR_PROTOCOL_UTXOS_ARCHIVE_AND_DELETE]),
                };
            } else if (isAdmin === true) {
                return {
                    label: 'Finishing',
                    labelClass: 'finishing',
                    buttonsForCards: [ButtonForCards[ButtonsForCardsEnum.VALIDATE_FUNDRAISING], LEARN_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE([ButtonForDetails[ButtonsForDetailsEnum.VALIDATE_FUNDRAISING]]),
                    buttonsForDetails: MANAGE([ButtonForDetails[ButtonsForDetailsEnum.VALIDATE_FUNDRAISING], UTXO], [], true),
                };
            } else {
                return {
                    label: 'Finishing',
                    labelClass: 'finishing',
                    buttonsForCards: [LEARN_FOR_CARD],
                    buttonsForHeader: [CONTACT],
                    buttonsForDetails: [CONTACT],
                };
            }

        case CampaignStatus_Code_Id_Enums.FAILED:
            if (isProtocolTeam === true) {
                return {
                    label: 'Failed',
                    labelClass: 'failed',
                    buttonsForCards: [ButtonForCards[ButtonsForCardsEnum.WITHDRAW_FAILED], LEARN_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE_OR_SAVE([ButtonForDetails[ButtonsForDetailsEnum.WITHDRAW_FAILED]]),
                    buttonsForDetails: MANAGE_EDIT_OR_SAVE([ButtonForDetails[ButtonsForDetailsEnum.WITHDRAW_FAILED], ...FOR_PROTOCOL_UTXOS_ARCHIVE_AND_DELETE]),
                };
            } else if (isAdmin === true) {
                return {
                    label: 'Failed',
                    labelClass: 'failed',
                    buttonsForCards: [ButtonForCards[ButtonsForCardsEnum.WITHDRAW_FAILED], LEARN_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE([ButtonForDetails[ButtonsForDetailsEnum.WITHDRAW_FAILED]]),
                    buttonsForDetails: MANAGE([ButtonForDetails[ButtonsForDetailsEnum.WITHDRAW_FAILED], UTXO], [], true),
                };
            } else {
                return {
                    label: 'Failed',
                    labelClass: 'failed',
                    buttonsForCards: [ButtonForCards[ButtonsForCardsEnum.GETBACK_FAILED], LEARN_FOR_CARD],
                    buttonsForHeader: [ButtonForDetails[ButtonsForDetailsEnum.GETBACK_FAILED]],
                    buttonsForDetails: [ButtonForDetails[ButtonsForDetailsEnum.GETBACK_FAILED], CONTACT],
                };
            }

        case CampaignStatus_Code_Id_Enums.UNREACHED:
            if (isProtocolTeam === true) {
                return {
                    label: 'Unreached',
                    labelClass: 'unreached',
                    buttonsForCards: [ButtonForCards[ButtonsForCardsEnum.WITHDRAW_UNREACHED], LEARN_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE_OR_SAVE([ButtonForDetails[ButtonsForDetailsEnum.WITHDRAW_UNREACHED]]),
                    buttonsForDetails: MANAGE_EDIT_OR_SAVE([ButtonForDetails[ButtonsForDetailsEnum.WITHDRAW_UNREACHED], ...FOR_PROTOCOL_UTXOS_ARCHIVE_AND_DELETE]),
                };
            } else if (isAdmin === true) {
                return {
                    label: 'Unreached',
                    labelClass: 'unreached',
                    buttonsForCards: [ButtonForCards[ButtonsForCardsEnum.WITHDRAW_UNREACHED], LEARN_OR_MANAGE_FOR_CARD],
                    buttonsForHeader: MANAGE([ButtonForDetails[ButtonsForDetailsEnum.WITHDRAW_UNREACHED]]),
                    buttonsForDetails: MANAGE([ButtonForDetails[ButtonsForDetailsEnum.WITHDRAW_UNREACHED], UTXO], [], true),
                };
            } else {
                return {
                    label: 'Unreached',
                    labelClass: 'unreached',
                    buttonsForCards: [ButtonForCards[ButtonsForCardsEnum.GETBACK_UNREACHED], LEARN_FOR_CARD],
                    buttonsForHeader: [ButtonForDetails[ButtonsForDetailsEnum.GETBACK_UNREACHED]],
                    buttonsForDetails: [ButtonForDetails[ButtonsForDetailsEnum.GETBACK_UNREACHED], CONTACT],
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
                    buttonsForCards: [LEARN_FOR_CARD],
                    buttonsForHeader: [CONTACT],
                    buttonsForDetails: [CONTACT],
                };
            }

        case CampaignStatus_Code_Id_Enums.ACTIVE:
            if (totalMilestones === 0 || currentMilestoneIndex === undefined || milestone_status_code_id === undefined) {
                throw new Error('Milestone status code_id is required');
            }
            if (isProtocolTeam === true || isAdmin === true || isEditor === true) {
                switch (milestone_status_code_id) {
                    case MilestoneStatus_Code_Id_Enums.NOT_STARTED:
                        if (isProtocolTeam === true) {
                            return {
                                label: `Active ${currentMilestoneIndex + 1}/${totalMilestones}`,
                                labelClass: 'active',
                                buttonsForCards: [ButtonForCards[ButtonsForCardsEnum.VIEW_MILESTONES], VIEW_OR_MANAGE_FOR_CARD],
                                buttonsForHeader: MANAGE_EDIT_OR_SAVE([]),
                                buttonsForDetails: MANAGE_EDIT_OR_SAVE([...FOR_PROTOCOL_UTXOS_ARCHIVE_AND_DELETE]),
                            };
                        } else if (isAdmin === true) {
                            return {
                                label: `Active ${currentMilestoneIndex + 1}/${totalMilestones}`,
                                labelClass: 'active',
                                buttonsForCards: [ButtonForCards[ButtonsForCardsEnum.VIEW_MILESTONES], VIEW_OR_MANAGE_FOR_CARD],
                                buttonsForHeader: MANAGE([UTXO]),
                                buttonsForDetails: MANAGE([UTXO], [], true),
                            };
                        } else if (isEditor === true) {
                            return {
                                label: `Active ${currentMilestoneIndex + 1}/${totalMilestones}`,
                                labelClass: 'active',
                                buttonsForCards: [ButtonForCards[ButtonsForCardsEnum.VIEW_MILESTONES], LEARN_FOR_CARD],
                                buttonsForHeader: [CONTACT],
                                buttonsForDetails: [CONTACT],
                            };
                        }
                    case MilestoneStatus_Code_Id_Enums.STARTED:
                        if (isProtocolTeam === true) {
                            return {
                                label: `Active ${currentMilestoneIndex + 1}/${totalMilestones}`,
                                labelClass: 'active',
                                buttonsForCards: [ButtonForCards[ButtonsForCardsEnum.SUBMIT_MILESTONE], VIEW_OR_MANAGE_FOR_CARD],
                                buttonsForHeader: MANAGE_OR_SAVE([ButtonForDetails[ButtonsForDetailsEnum.SUBMIT_MILESTONE]]),
                                buttonsForDetails: MANAGE_EDIT_OR_SAVE([ButtonForDetails[ButtonsForDetailsEnum.SUBMIT_MILESTONE], ...FOR_PROTOCOL_UTXOS_ARCHIVE_AND_DELETE]),
                            };
                        } else if (isAdmin === true) {
                            return {
                                label: `Active ${currentMilestoneIndex + 1}/${totalMilestones}`,
                                labelClass: 'active',
                                buttonsForCards: [ButtonForCards[ButtonsForCardsEnum.SUBMIT_MILESTONE], VIEW_OR_MANAGE_FOR_CARD],
                                buttonsForHeader: MANAGE([ButtonForDetails[ButtonsForDetailsEnum.SUBMIT_MILESTONE]]),
                                buttonsForDetails: MANAGE([ButtonForDetails[ButtonsForDetailsEnum.SUBMIT_MILESTONE], UTXO], [], true),
                            };
                        } else if (isEditor === true) {
                            return {
                                label: `Active ${currentMilestoneIndex + 1}/${totalMilestones}`,
                                labelClass: 'active',
                                buttonsForCards: [ButtonForCards[ButtonsForCardsEnum.SUBMIT_MILESTONE], VIEW_OR_MANAGE_FOR_CARD],
                                buttonsForHeader: MANAGE([ButtonForDetails[ButtonsForDetailsEnum.SUBMIT_MILESTONE]]),
                                buttonsForDetails: MANAGE([ButtonForDetails[ButtonsForDetailsEnum.SUBMIT_MILESTONE]], [], true),
                            };
                        }
                    case MilestoneStatus_Code_Id_Enums.SUBMITTED:
                        if (isProtocolTeam === true) {
                            return {
                                label: `Active ${currentMilestoneIndex + 1}/${totalMilestones}`,
                                labelClass: 'active',
                                buttonsForCards: [ButtonForCards[ButtonsForCardsEnum.MANAGE_MILESTONE_SUBMISSIONS], VIEW_OR_MANAGE_FOR_CARD],
                                buttonsForHeader: MANAGE_OR_SAVE([ButtonForDetails[ButtonsForDetailsEnum.MANAGE_MILESTONE_SUBMISSIONS]]),
                                buttonsForDetails: MANAGE_EDIT_OR_SAVE([
                                    ButtonForDetails[ButtonsForDetailsEnum.MANAGE_MILESTONE_SUBMISSIONS],
                                    ButtonForDetails[ButtonsForDetailsEnum.VIEW_MILESTONE_SUBMISSIONS],
                                    ...FOR_PROTOCOL_UTXOS_ARCHIVE_AND_DELETE,
                                ]),
                            };
                        } else if (isAdmin === true) {
                            return {
                                label: `Active ${currentMilestoneIndex + 1}/${totalMilestones}`,
                                labelClass: 'active',
                                buttonsForCards: [ButtonForCards[ButtonsForCardsEnum.VIEW_CAMPAIGN_SUBMISSIONS], VIEW_OR_MANAGE_FOR_CARD],
                                buttonsForHeader: MANAGE([ButtonForDetails[ButtonsForDetailsEnum.VIEW_CAMPAIGN_SUBMISSIONS]]),
                                buttonsForDetails: MANAGE([ButtonForDetails[ButtonsForDetailsEnum.VIEW_CAMPAIGN_SUBMISSIONS], UTXO], [], true),
                            };
                        } else if (isEditor === true) {
                            return {
                                label: `Active ${currentMilestoneIndex + 1}/${totalMilestones}`,
                                labelClass: 'active',
                                buttonsForCards: [ButtonForCards[ButtonsForCardsEnum.VIEW_CAMPAIGN_SUBMISSIONS], VIEW_OR_MANAGE_FOR_CARD],
                                buttonsForHeader: MANAGE([ButtonForDetails[ButtonsForDetailsEnum.VIEW_CAMPAIGN_SUBMISSIONS]]),
                                buttonsForDetails: MANAGE([ButtonForDetails[ButtonsForDetailsEnum.VIEW_CAMPAIGN_SUBMISSIONS]], [], true),
                            };
                        }
                    case MilestoneStatus_Code_Id_Enums.REJECTED:
                        if (isProtocolTeam === true) {
                            return {
                                label: `Active ${currentMilestoneIndex + 1}/${totalMilestones}`,
                                labelClass: 'active',
                                buttonsForCards: [ButtonForCards[ButtonsForCardsEnum.VIEW_MILESTONE_SUBMISSIONS], VIEW_OR_MANAGE_FOR_CARD],
                                buttonsForHeader: MANAGE_OR_SAVE([ButtonForDetails[ButtonsForDetailsEnum.VIEW_MILESTONE_SUBMISSIONS]]),
                                buttonsForDetails: MANAGE_EDIT_OR_SAVE([
                                    ButtonForDetails[ButtonsForDetailsEnum.VIEW_MILESTONE_SUBMISSIONS],
                                    ButtonForDetails[ButtonsForDetailsEnum.SUBMIT_MILESTONE],
                                    ...FOR_PROTOCOL_UTXOS_ARCHIVE_AND_DELETE,
                                ]),
                            };
                        } else if (isAdmin === true) {
                            return {
                                label: `Active ${currentMilestoneIndex + 1}/${totalMilestones}`,
                                labelClass: 'active',
                                buttonsForCards: [ButtonForCards[ButtonsForCardsEnum.VIEW_MILESTONE_SUBMISSIONS], VIEW_OR_MANAGE_FOR_CARD],
                                buttonsForHeader: MANAGE([ButtonForDetails[ButtonsForDetailsEnum.VIEW_MILESTONE_SUBMISSIONS]]),
                                buttonsForDetails: MANAGE(
                                    [ButtonForDetails[ButtonsForDetailsEnum.VIEW_MILESTONE_SUBMISSIONS], ButtonForDetails[ButtonsForDetailsEnum.SUBMIT_MILESTONE], UTXO],
                                    [],
                                    true
                                ),
                            };
                        } else if (isEditor === true) {
                            return {
                                label: `Active ${currentMilestoneIndex + 1}/${totalMilestones}`,
                                labelClass: 'active',
                                buttonsForCards: [ButtonForCards[ButtonsForCardsEnum.VIEW_MILESTONE_SUBMISSIONS], VIEW_OR_MANAGE_FOR_CARD],
                                buttonsForHeader: MANAGE([ButtonForDetails[ButtonsForDetailsEnum.VIEW_MILESTONE_SUBMISSIONS]], [], true),
                                buttonsForDetails: MANAGE(
                                    [ButtonForDetails[ButtonsForDetailsEnum.VIEW_MILESTONE_SUBMISSIONS], ButtonForDetails[ButtonsForDetailsEnum.SUBMIT_MILESTONE]],
                                    [],
                                    true
                                ),
                            };
                        }
                    case MilestoneStatus_Code_Id_Enums.COLLECT:
                        if (isProtocolTeam === true) {
                            return {
                                label: `Active ${currentMilestoneIndex + 1}/${totalMilestones}`,
                                labelClass: 'active',
                                buttonsForCards: [VIEW_OR_MANAGE_FOR_CARD],
                                buttonsForHeader: MANAGE_OR_SAVE([ButtonForDetails[ButtonsForDetailsEnum.VIEW_MILESTONE_SUBMISSIONS]]),
                                buttonsForDetails: MANAGE_EDIT_OR_SAVE([
                                    ButtonForDetails[ButtonsForDetailsEnum.VIEW_MILESTONE_SUBMISSIONS],
                                    ...FOR_PROTOCOL_UTXOS_ARCHIVE_AND_DELETE,
                                ]),
                            };
                        } else if (isAdmin === true) {
                            return {
                                label: `Active ${currentMilestoneIndex + 1}/${totalMilestones}`,
                                labelClass: 'active',
                                buttonsForCards: [ButtonForCards[ButtonsForCardsEnum.COLLECT_MILESTONE], VIEW_OR_MANAGE_FOR_CARD],
                                buttonsForHeader: MANAGE([ButtonForDetails[ButtonsForDetailsEnum.COLLECT_MILESTONE]]),
                                buttonsForDetails: MANAGE(
                                    [ButtonForDetails[ButtonsForDetailsEnum.COLLECT_MILESTONE], ButtonForDetails[ButtonsForDetailsEnum.VIEW_MILESTONE_SUBMISSIONS], UTXO],
                                    [],
                                    true
                                ),
                            };
                        } else if (isEditor === true) {
                            return {
                                label: `Active ${currentMilestoneIndex + 1}/${totalMilestones}`,
                                labelClass: 'active',
                                buttonsForCards: [ButtonForCards[ButtonsForCardsEnum.VIEW_MILESTONE_SUBMISSIONS], VIEW_OR_MANAGE_FOR_CARD],
                                buttonsForHeader: MANAGE([ButtonForDetails[ButtonsForDetailsEnum.VIEW_MILESTONE_SUBMISSIONS]], [], true),
                                buttonsForDetails: MANAGE([ButtonForDetails[ButtonsForDetailsEnum.VIEW_MILESTONE_SUBMISSIONS]], [], true),
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
            } else {
                return {
                    label: `Active ${currentMilestoneIndex + 1}/${totalMilestones}`,
                    labelClass: 'active',
                    buttonsForCards: [ButtonForCards[ButtonsForCardsEnum.VIEW_MILESTONES], LEARN_FOR_CARD],
                    buttonsForHeader: [CONTACT],
                    buttonsForDetails: [CONTACT],
                };
            }
    }

    throw new Error(`No Info found for code_id: ${campaign_status_code_id}`);
};
