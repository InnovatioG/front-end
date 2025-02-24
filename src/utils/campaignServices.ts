import { CampaignStatusEntity, CampaignSubmissionEntity, SubmissionStatusEntity } from '@/lib/SmartDB/Entities';
import { CampaignApi, CampaignContentApi, CampaignFaqsApi, CampaignMemberApi, CampaignSubmissionApi, MilestoneApi, MilestoneSubmissionApi } from '@/lib/SmartDB/FrontEnd';
import { CampaignEX, MilestoneEX } from '@/types/types';
import { isNullOrBlank, pushSucessNotification, pushWarningNotification } from 'smart-db';
import { CampaignStatus_Code_Id_Enums, SubmissionStatus_Enums } from './constants/status/status';
import { deleteFileFromS3, uploadMemberAvatarToS3 } from './s3Upload';
import { isBlobURL } from './utils';
import { getCampaignStatus_Db_Id_By_Code_Id } from './campaignHelpers';

export const saveEntityList = async <T extends { _DB_id?: string; campaign_id?: string }>(
    campaign_id: string,
    list: T[] | undefined,
    deletedList: T[] | undefined,
    updateApi: (id: string, entity: T) => Promise<T>,
    createApi: (entity: T) => Promise<T>,
    deleteApi: (id: string) => Promise<boolean>,
    imageFields: string[] = [] // Fields that store images
): Promise<{ savedEntities: T[]; filesToDelete: string[] }> => {
    const savedEntities: T[] = [];
    let filesToDelete: string[] = [];

    console.log(`saveEntityList`);

    // 🔹 **Upload images before saving entities**
    if (list) {
        for (const item of list) {
            // Process image fields
            for (const field of imageFields) {
                const imageUrl = (item as any)[field];

                if (!isNullOrBlank(imageUrl) && isBlobURL(imageUrl)) {
                    try {
                        const newImageUrl = await uploadMemberAvatarToS3(imageUrl);
                        (item as any)[field] = newImageUrl; // Update entity with new S3 URL
                        URL.revokeObjectURL(imageUrl); // Revoke previous picture
                    } catch (error) {
                        console.error(`Error uploading image for field "${field}" in entity ${item._DB_id}:`, error);
                    }
                }
            }

            // Save entity

            item.campaign_id = campaign_id;
            if (item._DB_id) {
                const updatedEntity = await updateApi(item._DB_id, item);
                savedEntities.push(updatedEntity);
            } else {
                const createdEntity = await createApi(item);
                savedEntities.push(createdEntity);
            }
        }
    }

    // 🔹 **Delete entities & collect image URLs to delete**
    if (deletedList) {
        for (const item of deletedList) {
            if (item._DB_id) {
                // Collect image URLs from deleted entities
                for (const field of imageFields) {
                    const imageUrl = (item as any)[field];
                    if (!isNullOrBlank(imageUrl) && !isBlobURL(imageUrl)) {
                        filesToDelete.push(imageUrl);
                    }
                }
                await deleteApi(item._DB_id);
            }
        }
    }

    return { savedEntities, filesToDelete };
};

export async function serviceSaveCampaign(
    campaign: CampaignEX,
    data?: Record<string, any>,
    onFinish?: (campaign: CampaignEX, data?: Record<string, any>) => Promise<void>
): Promise<string | undefined> {
    try {
        let entity = campaign.campaign;
        let allFilesToDelete: string[] = campaign.files_to_delete ? [...campaign.files_to_delete] : [];

        console.log(`handleSaveCampaign`);

        // SAVE CAMPAIGN

        const imageFields = ['banner_url', 'logo_url'];

        for (const field of imageFields) {
            const imageUrl = (entity as any)[field];
            if (!isNullOrBlank(imageUrl) && isBlobURL(imageUrl)) {
                try {
                    const newImageUrl = await uploadMemberAvatarToS3(imageUrl);
                    (entity as any)[field] = newImageUrl; // Update entity with new S3 URL
                    URL.revokeObjectURL(imageUrl); // Revoke previous picture
                } catch (error) {
                    console.error(`Error uploading image for field "${field}" in entity ${entity._DB_id}:`, error);
                }
            }
        }

        let campaign_id = campaign.campaign._DB_id;
        if (isNullOrBlank(campaign.campaign._DB_id)) {
            // entity.campaign_status_id = getCampaignStatus_Db_Id_By_Code_Id(CampaignStatus_Code_Id_Enums.CREATED);
            entity = await CampaignApi.createApi(entity);
            campaign_id = entity._DB_id;
        } else {
            entity = await CampaignApi.updateWithParamsApi_(campaign.campaign._DB_id, entity);
        }

        // 🔹 Save FAQs

        const { savedEntities: savedFaqs, filesToDelete: faqFiles } = await saveEntityList(
            campaign_id,
            campaign.faqs,
            campaign.faqs_deleted,
            CampaignFaqsApi.updateWithParamsApi_.bind(CampaignFaqsApi),
            CampaignFaqsApi.createApi.bind(CampaignFaqsApi),
            CampaignFaqsApi.deleteByIdApi_.bind(CampaignFaqsApi),
            []
        );

        allFilesToDelete.push(...faqFiles);

        // 🔹 Save Contents
        const { savedEntities: savedContents, filesToDelete: contentFiles } = await saveEntityList(
            campaign_id,
            campaign.contents,
            campaign.contents_deleted,
            CampaignContentApi.updateWithParamsApi_.bind(CampaignContentApi),
            CampaignContentApi.createApi.bind(CampaignContentApi),
            CampaignContentApi.deleteByIdApi_.bind(CampaignContentApi),
            ['']
        );
        allFilesToDelete.push(...contentFiles);

        // 🔹 Save Members
        const { savedEntities: savedMembers, filesToDelete: memberFiles } = await saveEntityList(
            campaign_id,
            campaign.members,
            campaign.members_deleted,
            CampaignMemberApi.updateWithParamsApi_.bind(CampaignMemberApi),
            CampaignMemberApi.createApi.bind(CampaignMemberApi),
            CampaignMemberApi.deleteByIdApi_.bind(CampaignMemberApi),
            ['avatar_url']
        );
        allFilesToDelete.push(...memberFiles);

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

        const { savedEntities: savedMilestoneEntities, filesToDelete: milestoneFiles } = await saveEntityList(
            campaign_id,
            campaign.milestones?.map((m) => m.milestone),
            campaign.milestones_deleted?.map((m) => m.milestone),
            MilestoneApi.updateWithParamsApi_.bind(MilestoneApi),
            MilestoneApi.createApi.bind(MilestoneApi),
            MilestoneApi.deleteByIdApi_.bind(MilestoneApi),
            []
        );
        allFilesToDelete.push(...milestoneFiles);

        const milestoneMap = new Map((campaign.milestones || []).filter((m) => m.milestone._DB_id).map((m) => [m.milestone._DB_id!, m.milestone_submissions]));

        const savedMilestones: MilestoneEX[] = savedMilestoneEntities.map((milestoneEntity) => ({
            milestone: milestoneEntity,
            milestone_submissions: milestoneMap.get(milestoneEntity._DB_id!) || [],
        }));

        // 🔹 **Final Cleanup: Delete All Files from S3**
        if (allFilesToDelete.length > 0) {
            console.log('Deleting files from S3:', allFilesToDelete);
            await Promise.all(
                allFilesToDelete.map(async (fileKey) => {
                    try {
                        const bucketName = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!;
                        await deleteFileFromS3(bucketName, fileKey);
                    } catch (error) {
                        console.error(`Error deleting file from S3: ${fileKey}`, error);
                    }
                })
            );
        }

        pushSucessNotification('Success', 'Saved successfully', false);

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

        return entity._DB_id;
    } catch (e) {
        console.error(e);
        pushWarningNotification('Error', `Error saving: ${e}`);
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
    submissionStatus: SubmissionStatusEntity[],
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

        const statusSubmission = submissionStatus.find((status) => status.code_id === SubmissionStatus_Enums.SUBMITTED);

        if (!statusSubmission) {
            throw new Error(`Status SUBMITTED code-id: ${SubmissionStatus_Enums.SUBMITTED} not found`);
        }

        let entity = campaign.campaign;
        entity.campaign_status_id = status._DB_id;

        entity = await CampaignApi.updateWithParamsApi_(campaign.campaign._DB_id, entity);

        let submission: CampaignSubmissionEntity = new CampaignSubmissionEntity({
            campaign_id: campaign.campaign._DB_id,
            submission_status_id: statusSubmission?._DB_id,
            submitted_by_wallet_id: data?.submitted_by_wallet_id,
        });

        submission = await CampaignSubmissionApi.createApi(submission);

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
    submissionStatus: SubmissionStatusEntity[],
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

        const statusSubmission = submissionStatus.find((status) => status.code_id === SubmissionStatus_Enums.APPROVED);

        if (!statusSubmission) {
            throw new Error(`Status APPROVED code-id: ${SubmissionStatus_Enums.APPROVED} not found`);
        }

        let entity = campaign.campaign;
        entity.campaign_status_id = status._DB_id;

        entity = await CampaignApi.updateWithParamsApi_(campaign.campaign._DB_id, entity);

        const submission: CampaignSubmissionEntity | undefined = await CampaignSubmissionApi.getOneByParamsApi_({ campaign_id: campaign.campaign._DB_id });
        if (!submission) {
            throw new Error(`Submission not found for campaign_id: ${campaign.campaign._DB_id}`);
        }

        await CampaignSubmissionApi.updateWithParamsApi_(submission._DB_id, {
            ...submission,
            submission_status_id: statusSubmission._DB_id,
            revised_by_wallet_id: data?.revised_by_wallet_id,
            approved_justification: data?.justification,
        });

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
    submissionStatus: SubmissionStatusEntity[],
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

        const statusSubmission = submissionStatus.find((status) => status.code_id === SubmissionStatus_Enums.REJECTED);

        if (!statusSubmission) {
            throw new Error(`Status REJECTED code-id: ${SubmissionStatus_Enums.REJECTED} not found`);
        }

        let entity = campaign.campaign;
        entity.campaign_status_id = status._DB_id;

        entity = await CampaignApi.updateWithParamsApi_(campaign.campaign._DB_id, entity);

        const submission: CampaignSubmissionEntity | undefined = await CampaignSubmissionApi.getOneByParamsApi_({ campaign_id: campaign.campaign._DB_id });
        if (!submission) {
            throw new Error(`Submission not found for campaign_id: ${campaign.campaign._DB_id}`);
        }

        await CampaignSubmissionApi.updateWithParamsApi_(submission._DB_id, {
            ...submission,
            submission_status_id: statusSubmission._DB_id,
            revised_by_wallet_id: data?.revised_by_wallet_id,
            rejected_justification: data?.justification,
        });

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
