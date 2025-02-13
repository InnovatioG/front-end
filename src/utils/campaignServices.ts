import { CampaignEntity, CampaignStatusEntity, MilestoneEntity } from '@/lib/SmartDB/Entities';
import { CampaignApi, CampaignFaqsApi, CampaignContentApi, CampaignMemberApi, MilestoneSubmissionApi, MilestoneApi } from '@/lib/SmartDB/FrontEnd';
import { CampaignEX, MilestoneEX } from '@/types/types';
import { pushSucessNotification, pushWarningNotification } from 'smart-db';
import { CampaignStatus_Code_Id_Enums } from './constants/status/status';

export const saveEntityList = async <T extends { _DB_id?: string }>(
    list: T[] | undefined,
    deletedList: T[] | undefined,
    updateApi: (id: string, entity: T) => Promise<T>,
    createApi: (entity: T) => Promise<T>,
    deleteApi: (id: string) => Promise<boolean>
): Promise<T[]> => {
    const savedEntities: T[] = [];

    console.log(`saveEntityList`);

    // 🔹 Update existing & create new items
    if (list) {
        for (const item of list) {
            if (item._DB_id) {
                const updatedEntity = await updateApi(item._DB_id, item);
                savedEntities.push(updatedEntity);
            } else {
                const createdEntity = await createApi(item);
                savedEntities.push(createdEntity);
            }
        }
    }

    // 🔹 Delete removed items
    if (deletedList) {
        for (const item of deletedList) {
            if (item._DB_id) {
                await deleteApi(item._DB_id);
            }
        }
    }

    return savedEntities;
};

export async function serviceSaveCampaign(campaign: CampaignEX, data?: Record<string, any>, onFinish?: (campaign: CampaignEX, data?: Record<string, any>) => Promise<void>) {
    try {
        let entity = campaign.campaign;
        console.log(`handleSaveCampaign`);

        entity = await CampaignApi.updateWithParamsApi_(campaign.campaign._DB_id, entity);
        console.log(`handleSaveCampaign ${campaign.faqs_deleted?.length}`);

        const savedFaqs = await saveEntityList(
            campaign.faqs,
            campaign.faqs_deleted,
            CampaignFaqsApi.updateWithParamsApi_.bind(CampaignFaqsApi),
            CampaignFaqsApi.createApi.bind(CampaignFaqsApi),
            CampaignFaqsApi.deleteByIdApi_.bind(CampaignFaqsApi)
        );

        const savedContents = await saveEntityList(
            campaign.contents,
            campaign.contents_deleted,
            CampaignContentApi.updateWithParamsApi_.bind(CampaignContentApi),
            CampaignContentApi.createApi.bind(CampaignContentApi),
            CampaignContentApi.deleteByIdApi_.bind(CampaignContentApi)
        );

        const savedMembers = await saveEntityList(
            campaign.members,
            campaign.members_deleted,
            CampaignMemberApi.updateWithParamsApi_.bind(CampaignMemberApi),
            CampaignMemberApi.createApi.bind(CampaignMemberApi),
            CampaignMemberApi.deleteByIdApi_.bind(CampaignMemberApi)
        );

        if (campaign.milestones_deleted) {
            await Promise.all(
                campaign.milestones_deleted.map(async (milestoneEX) => {
                    if (milestoneEX.milestone_submissions) {
                        await Promise.all(
                            milestoneEX.milestone_submissions.map(async (submission) => {
                                if (submission._DB_id) {
                                    await MilestoneSubmissionApi.deleteByIdApi_(submission._DB_id);
                                }
                            })
                        );
                    }
                })
            );
        }

        const savedMilestoneEntities: MilestoneEntity[] = await saveEntityList(
            campaign.milestones?.map((m) => m.milestone),
            campaign.milestones_deleted?.map((m) => m.milestone),
            MilestoneApi.updateWithParamsApi_.bind(MilestoneApi),
            MilestoneApi.createApi.bind(MilestoneApi),
            MilestoneApi.deleteByIdApi_.bind(MilestoneApi)
        );

        const milestoneMap = new Map((campaign.milestones || []).filter((m) => m.milestone._DB_id).map((m) => [m.milestone._DB_id!, m.milestone_submissions]));

        const savedMilestones: MilestoneEX[] = savedMilestoneEntities.map((milestoneEntity) => ({
            milestone: milestoneEntity,
            milestone_submissions: milestoneMap.get(milestoneEntity._DB_id!) || [],
        }));

        pushSucessNotification('Success', 'Updated successfully', false);

        const campaignEX: CampaignEX = {
            campaign: entity,
            faqs: savedFaqs,
            contents: savedContents,
            members: savedMembers,
            campaign_submissions: campaign.campaign_submissions,
            milestones: savedMilestones,
        };

        if (onFinish !== undefined) {
            await onFinish(campaignEX, data);
        }
    } catch (e) {
        console.error(e);
        pushWarningNotification('Error', `Error updating: ${e}`);
    }
}

export async function serviceFeatureCampaign(campaign: CampaignEX, data?: Record<string, any>, onFinish?: (campaign: CampaignEX, data?: Record<string, any>) => Promise<void>) {
    try {
        let entity = campaign.campaign;
        entity.featured = true;

        entity = await CampaignApi.updateWithParamsApi_(campaign.campaign._DB_id, entity);

        pushSucessNotification('Success', 'Updated successfully', false);

        if (onFinish !== undefined) {
            await onFinish(campaign, data);
        }
    } catch (e) {
        console.error(e);
        pushWarningNotification('Error', `Error updating: ${e}`);
    }
}

export async function serviceUnFeatureCampaign(campaign: CampaignEX, data?: Record<string, any>, onFinish?: (campaign: CampaignEX, data?: Record<string, any>) => Promise<void>) {
    try {
        let entity = campaign.campaign;
        entity.featured = false;

        entity = await CampaignApi.updateWithParamsApi_(campaign.campaign._DB_id, entity);

        pushSucessNotification('Success', 'Updated successfully', false);

        if (onFinish !== undefined) {
            await onFinish(campaign, data);
        }
    } catch (e) {
        console.error(e);
        pushWarningNotification('Error', `Error updating: ${e}`);
    }
}

export async function serviceArchiveCampaign(campaign: CampaignEX, data?: Record<string, any>, onFinish?: (campaign: CampaignEX, data?: Record<string, any>) => Promise<void>) {
    try {
        let entity = campaign.campaign;
        entity.archived = true;

        entity = await CampaignApi.updateWithParamsApi_(campaign.campaign._DB_id, entity);

        pushSucessNotification('Success', 'Updated successfully', false);

        if (onFinish !== undefined) {
            await onFinish(campaign, data);
        }
    } catch (e) {
        console.error(e);
        pushWarningNotification('Error', `Error updating: ${e}`);
    }
}

export async function serviceUnArchiveCampaign(campaign: CampaignEX, data?: Record<string, any>, onFinish?: (campaign: CampaignEX, data?: Record<string, any>) => Promise<void>) {
    try {
        let entity = campaign.campaign;
        entity.archived = false;

        entity = await CampaignApi.updateWithParamsApi_(campaign.campaign._DB_id, entity);

        pushSucessNotification('Success', 'Updated successfully', false);

        if (onFinish !== undefined) {
            await onFinish(campaign, data);
        }
    } catch (e) {
        console.error(e);
        pushWarningNotification('Error', `Error updating: ${e}`);
    }
}

export async function serviceSubmitCampaign(
    campaign: CampaignEX,
    campaignStatus: CampaignStatusEntity[],
    data?: Record<string, any>,
    onFinish?: (campaign: CampaignEX, data?: Record<string, any>) => Promise<void>
) {
    try {
        // Send to Revision (DB)
        // Descripción: Marca la campaña como lista para revisión por parte del Protocol Team. Crea una entrada en la tabla Campaign-Submission
        // Estado Inicial DB: Created/Rejected
        // Estado Final DB: Submitted
        // Ejecuta: Campaign Managers, Campaign Editors

        const status = campaignStatus.find((status) => status.code_id === CampaignStatus_Code_Id_Enums.SUBMITTED);

        if (!status) {
            throw new Error(`Status SUBMITTED code-id: ${CampaignStatus_Code_Id_Enums.SUBMITTED} not found`);
        }

        let entity = campaign.campaign;
        entity.campaign_status_id = status._DB_id;

        entity = await CampaignApi.updateWithParamsApi_(campaign.campaign._DB_id, entity);

        pushSucessNotification('Success', 'Updated successfully', false);

        if (onFinish !== undefined) {
            await onFinish(campaign, data);
        }
    } catch (e) {
        console.error(e);
        pushWarningNotification('Error', `Error updating: ${e}`);
    }
}

export async function serviceApproveCampaign(
    campaign: CampaignEX,
    campaignStatus: CampaignStatusEntity[],
    data?: Record<string, any>,
    onFinish?: (campaign: CampaignEX, data?: Record<string, any>) => Promise<void>
) {
    try {
        // Approve Campaign (DB)
        // Descripción: Aprueba la campaña para su despliegue en blockchain
        // Estado Inicial DB: Submitted
        // Estado Final DB: Approved
        // Ejecuta: Protocol Team

        const status = campaignStatus.find((status) => status.code_id === CampaignStatus_Code_Id_Enums.APPROVED);

        if (!status) {
            throw new Error(`Status APPROVED code-id: ${CampaignStatus_Code_Id_Enums.APPROVED} not found`);
        }

        let entity = campaign.campaign;
        entity.campaign_status_id = status._DB_id;

        entity = await CampaignApi.updateWithParamsApi_(campaign.campaign._DB_id, entity);

        pushSucessNotification('Success', 'Updated successfully', false);

        if (onFinish !== undefined) {
            await onFinish(campaign, data);
        }
    } catch (e) {
        console.error(e);
        pushWarningNotification('Error', `Error updating: ${e}`);
    }
}

export async function serviceRejectCampaign(
    campaign: CampaignEX,
    campaignStatus: CampaignStatusEntity[],
    data?: Record<string, any>,
    onFinish?: (campaign: CampaignEX, data?: Record<string, any>) => Promise<void>
) {
    try {
        // Reject Campaign (DB)
        // Descripción: Rechaza la campaña para que sea revisada y modificada
        // Estado Inicial DB: Submitted
        // Estado Final DB: Rejected
        // Ejecuta: Protocol Team

        const status = campaignStatus.find((status) => status.code_id === CampaignStatus_Code_Id_Enums.REJECTED);

        if (!status) {
            throw new Error(`Status REJECTED code-id: ${CampaignStatus_Code_Id_Enums.REJECTED} not found`);
        }

        let entity = campaign.campaign;
        entity.campaign_status_id = status._DB_id;

        entity = await CampaignApi.updateWithParamsApi_(campaign.campaign._DB_id, entity);

        pushSucessNotification('Success', 'Updated successfully', false);

        if (onFinish !== undefined) {
            await onFinish(campaign, data);
        }
    } catch (e) {
        console.error(e);
        pushWarningNotification('Error', `Error updating: ${e}`);
    }
}

export async function serviceCreateSmartContracts(
    campaign: CampaignEX,
    campaignStatus: CampaignStatusEntity[],
    data?: Record<string, any>,
    onFinish?: (campaign: CampaignEX, data?: Record<string, any>) => Promise<void>
) {
    try {
        // Create Campaign Contracts (DB)
        // Descripción: Crea los contratos específicos de la campaña (Campaign Policy y Campaign Funds Policy) y los almacena en la base de datos
        // Estado Inicial DB: Approved
        // Estado Final DB: Contract Created
        // Ejecuta: Protocol Team

        const status = campaignStatus.find((status) => status.code_id === CampaignStatus_Code_Id_Enums.CONTRACT_CREATED);

        if (!status) {
            throw new Error(`Status CONTRACT_CREATED code-id: ${CampaignStatus_Code_Id_Enums.CONTRACT_CREATED} not found`);
        }

        let entity = campaign.campaign;
        entity.campaign_status_id = status._DB_id;

        entity = await CampaignApi.updateWithParamsApi_(campaign.campaign._DB_id, entity);

        pushSucessNotification('Success', 'Updated successfully', false);

        if (onFinish !== undefined) {
            await onFinish(campaign, data);
        }
    } catch (e) {
        console.error(e);
        pushWarningNotification('Error', `Error updating: ${e}`);
    }
}

export async function servicePublishSmartContracts(
    campaign: CampaignEX,
    campaignStatus: CampaignStatusEntity[],
    data?: Record<string, any>,
    onFinish?: (campaign: CampaignEX, data?: Record<string, any>) => Promise<void>
) {
    try {
        // Publish Campaign Contracts (TX)
        // Descripción: Despliega los contratos de la campaña en la blockchain
        // Estado Inicial DB: Contract Created
        // Estado Final DB: Contract Published
        // Ejecuta: Protocol Team, Campaign Managers

        const status = campaignStatus.find((status) => status.code_id === CampaignStatus_Code_Id_Enums.CONTRACT_PUBLISHED);

        if (!status) {
            throw new Error(`Status CONTRACT_PUBLISHED code-id: ${CampaignStatus_Code_Id_Enums.CONTRACT_PUBLISHED} not found`);
        }

        let entity = campaign.campaign;
        entity.campaign_status_id = status._DB_id;

        entity = await CampaignApi.updateWithParamsApi_(campaign.campaign._DB_id, entity);

        pushSucessNotification('Success', 'Updated successfully', false);

        if (onFinish !== undefined) {
            await onFinish(campaign, data);
        }
    } catch (e) {
        console.error(e);
        pushWarningNotification('Error', `Error updating: ${e}`);
    }
}

export async function serviceInitializeCampaign(
    campaign: CampaignEX,
    campaignStatus: CampaignStatusEntity[],
    data?: Record<string, any>,
    onFinish?: (campaign: CampaignEX, data?: Record<string, any>) => Promise<void>
) {
    try {
        // Initialize Campaign Contracts (TX)
        // Descripción: Crea el datum inicial de la campaña en la blockchain
        // Estado Inicial DB: Contract Published (Milestones: Not Started)
        // Estado Final DB: Contract Started (Milestones: Not Started)
        // Estado Inicial Datum: N/A (Milestones: N/A)
        // Estado Final Datum: CsCreated (Milestones: MsCreated)
        // Ejecuta: Protocol Team

        const status = campaignStatus.find((status) => status.code_id === CampaignStatus_Code_Id_Enums.CONTRACT_STARTED);

        if (!status) {
            throw new Error(`Status CONTRACT_STARTED code-id: ${CampaignStatus_Code_Id_Enums.CONTRACT_STARTED} not found`);
        }

        let entity = campaign.campaign;
        entity.campaign_status_id = status._DB_id;

        entity = await CampaignApi.updateWithParamsApi_(campaign.campaign._DB_id, entity);

        pushSucessNotification('Success', 'Updated successfully', false);

        if (onFinish !== undefined) {
            await onFinish(campaign, data);
        }
    } catch (e) {
        console.error(e);
        pushWarningNotification('Error', `Error updating: ${e}`);
    }
}

export async function serviceLaunchCampaign(
    campaign: CampaignEX,
    campaignStatus: CampaignStatusEntity[],
    data?: Record<string, any>,
    onFinish?: (campaign: CampaignEX, data?: Record<string, any>) => Promise<void>
) {
    try {
        // Estado Inicial DB: Contract Started
        // Estado Final DB: Countdown/Fundraising/Finishing (según fecha)
        // Estado Inicial Datum: CsCreated
        // Estado Final Datum: CsInitialized

        const status = campaignStatus.find((status) => status.code_id === CampaignStatus_Code_Id_Enums.COUNTDOWN);

        if (!status) {
            throw new Error(`Status COUNTDOWN code-id: ${CampaignStatus_Code_Id_Enums.COUNTDOWN} not found`);
        }

        let entity = campaign.campaign;
        entity.campaign_status_id = status._DB_id;

        entity = await CampaignApi.updateWithParamsApi_(campaign.campaign._DB_id, entity);

        pushSucessNotification('Success', 'Updated successfully', false);

        if (onFinish !== undefined) {
            await onFinish(campaign, data);
        }
    } catch (e) {
        console.error(e);
        pushWarningNotification('Error', `Error updating: ${e}`);
    }
}

export async function serviceSetFundraisingCampaign(
    campaign: CampaignEX,
    campaignStatus: CampaignStatusEntity[],
    data?: Record<string, any>,
    onFinish?: (campaign: CampaignEX, data?: Record<string, any>) => Promise<void>
) {
    try {
        // TODO: MOCK, no existe este, pasa automaticamente por fecha
        // Estado Inicial DB: Countdown
        // Estado Final DB: Fundraising
        // Estado Inicial Datum: CsInitialized
        // Estado Final Datum: CsInitialized

        const status = campaignStatus.find((status) => status.code_id === CampaignStatus_Code_Id_Enums.FUNDRAISING);

        if (!status) {
            throw new Error(`Status FUNDRAISING code-id: ${CampaignStatus_Code_Id_Enums.FUNDRAISING} not found`);
        }

        let entity = campaign.campaign;
        entity.campaign_status_id = status._DB_id;

        entity = await CampaignApi.updateWithParamsApi_(campaign.campaign._DB_id, entity);

        pushSucessNotification('Success', 'Updated successfully', false);

        if (onFinish !== undefined) {
            await onFinish(campaign, data);
        }
    } catch (e) {
        console.error(e);
        pushWarningNotification('Error', `Error updating: ${e}`);
    }
}

export async function serviceSetFinishingCampaign(
    campaign: CampaignEX,
    campaignStatus: CampaignStatusEntity[],
    data?: Record<string, any>,
    onFinish?: (campaign: CampaignEX, data?: Record<string, any>) => Promise<void>
) {
    try {
        // TODO: MOCK, no existe este, pasa automaticamente por fecha
        // Estado Inicial DB: Fundraising
        // Estado Final DB: Finishing
        // Estado Inicial Datum: CsInitialized
        // Estado Final Datum: CsInitialized

        const status = campaignStatus.find((status) => status.code_id === CampaignStatus_Code_Id_Enums.FINISHING);

        if (!status) {
            throw new Error(`Status FINISHING code-id: ${CampaignStatus_Code_Id_Enums.FINISHING} not found`);
        }

        let entity = campaign.campaign;
        entity.campaign_status_id = status._DB_id;

        entity = await CampaignApi.updateWithParamsApi_(campaign.campaign._DB_id, entity);

        pushSucessNotification('Success', 'Updated successfully', false);

        if (onFinish !== undefined) {
            await onFinish(campaign, data);
        }
    } catch (e) {
        console.error(e);
        pushWarningNotification('Error', `Error updating: ${e}`);
    }
}

export async function serviceValidateFundraisingStatusSetReached(
    campaign: CampaignEX,
    campaignStatus: CampaignStatusEntity[],
    data?: Record<string, any>,
    onFinish?: (campaign: CampaignEX, data?: Record<string, any>) => Promise<void>
) {
    try {
        // TODO: MOCK, no existe este, valida active or unreached por cantidad de tokens

        // Campaign Reached (TX)
        // Descripción: Marca campaña como exitosa en alcanzar objetivo mínimo. El contrato verifica que la cantidad de tokens vendidos supere el mínimo esperado
        // Estado Inicial DB: Finishing (Milestone 1: Not Started)
        // Estado Final DB: Active (Milestone 1: Started)
        // Estado Inicial Datum: CsInitialized (Milestone 1: MsCreated)
        // Estado Final Datum: CsReached (Milestone 1: MsCreated)
        // Ejecuta: Protocol Team, Campaign Managers

        // Campaign Not Reached (TX)
        // Descripción: Marca campaña como fallida en alcanzar objetivo mínimo. El contrato verifica que la cantidad de tokens vendidos no supera el mínimo esperado.
        // Estado Inicial DB: Finishing
        // Estado Final DB: Unreached
        // Estado Inicial Datum: CsInitialized
        // Estado Final Datum: CsNotReached
        // Ejecuta: Protocol Team, Campaign Managers

        const status = campaignStatus.find((status) => status.code_id === CampaignStatus_Code_Id_Enums.ACTIVE);

        if (!status) {
            throw new Error(`Status ACTIVE code-id: ${CampaignStatus_Code_Id_Enums.ACTIVE} not found`);
        }

        let entity = campaign.campaign;
        entity.campaign_status_id = status._DB_id;

        entity = await CampaignApi.updateWithParamsApi_(campaign.campaign._DB_id, entity);

        pushSucessNotification('Success', 'Updated successfully', false);

        if (onFinish !== undefined) {
            await onFinish(campaign, data);
        }
    } catch (e) {
        console.error(e);
        pushWarningNotification('Error', `Error updating: ${e}`);
    }
}

export async function serviceValidateFundraisingStatusSetUnReached(
    campaign: CampaignEX,
    campaignStatus: CampaignStatusEntity[],
    data?: Record<string, any>,
    onFinish?: (campaign: CampaignEX, data?: Record<string, any>) => Promise<void>
) {
    try {
        // TODO: MOCK, no existe este, valida active or unreached por cantidad de tokens

        // Campaign Reached (TX)
        // Descripción: Marca campaña como exitosa en alcanzar objetivo mínimo. El contrato verifica que la cantidad de tokens vendidos supere el mínimo esperado
        // Estado Inicial DB: Finishing (Milestone 1: Not Started)
        // Estado Final DB: Active (Milestone 1: Started)
        // Estado Inicial Datum: CsInitialized (Milestone 1: MsCreated)
        // Estado Final Datum: CsReached (Milestone 1: MsCreated)
        // Ejecuta: Protocol Team, Campaign Managers

        // Campaign Not Reached (TX)
        // Descripción: Marca campaña como fallida en alcanzar objetivo mínimo. El contrato verifica que la cantidad de tokens vendidos no supera el mínimo esperado.
        // Estado Inicial DB: Finishing
        // Estado Final DB: Unreached
        // Estado Inicial Datum: CsInitialized
        // Estado Final Datum: CsNotReached
        // Ejecuta: Protocol Team, Campaign Managers

        const status = campaignStatus.find((status) => status.code_id === CampaignStatus_Code_Id_Enums.UNREACHED);

        if (!status) {
            throw new Error(`Status UNREACHED code-id: ${CampaignStatus_Code_Id_Enums.UNREACHED} not found`);
        }

        let entity = campaign.campaign;
        entity.campaign_status_id = status._DB_id;

        entity = await CampaignApi.updateWithParamsApi_(campaign.campaign._DB_id, entity);

        pushSucessNotification('Success', 'Updated successfully', false);

        if (onFinish !== undefined) {
            await onFinish(campaign, data);
        }
    } catch (e) {
        console.error(e);
        pushWarningNotification('Error', `Error updating: ${e}`);
    }
}

export async function serviceFailMilestoneAndCampaign(
    campaign: CampaignEX,
    campaignStatus: CampaignStatusEntity[],
    data?: Record<string, any>,
    onFinish?: (campaign: CampaignEX, data?: Record<string, any>) => Promise<void>
) {
    try {
        // Fail Milestone (TX)
        // Descripción: Falla permanentemente el milestone, fallando la campaña
        // Estado Inicial DB: Active (Milestone actual: Submitted/Rejected)
        // Estado Final DB: Failed
        // Estado Inicial Datum: CsReached (Milestone actual: MsCreated)
        // Estado Final Datum: CsFailedMilestone (Milestone actual: MsFailed)
        // Ejecuta: Protocol Team

        const status = campaignStatus.find((status) => status.code_id === CampaignStatus_Code_Id_Enums.FAILED);

        if (!status) {
            throw new Error(`Status FAILED code-id: ${CampaignStatus_Code_Id_Enums.FAILED} not found`);
        }

        let entity = campaign.campaign;
        entity.campaign_status_id = status._DB_id;

        entity = await CampaignApi.updateWithParamsApi_(campaign.campaign._DB_id, entity);

        pushSucessNotification('Success', 'Updated successfully', false);

        if (onFinish !== undefined) {
            await onFinish(campaign, data);
        }
    } catch (e) {
        console.error(e);
        pushWarningNotification('Error', `Error updating: ${e}`);
    }
}
