import {
    CampaignAddScriptsTxParams,
    CampaignCampaingNotReachedTxParams,
    CampaignCampaingReachedTxParams,
    CampaignDeployTxParams,
    CampaignFundsAddTxParams,
    CampaignFundsInvestTxParams,
    CampaignFundsMintDepositTxParams,
    CampaignLaunchTxParams,
} from '@/lib/SmartDB/Commons/Params';
import { CampaignEntity, CampaignFundsEntity, CampaignStatusEntity, CampaignSubmissionEntity, ProtocolEntity, SubmissionStatusEntity } from '@/lib/SmartDB/Entities';
import {
    CampaignApi,
    CampaignContentApi,
    CampaignFaqsApi,
    CampaignFundsApi,
    CampaignMemberApi,
    CampaignSubmissionApi,
    MilestoneApi,
    MilestoneSubmissionApi,
    ScriptApi,
} from '@/lib/SmartDB/FrontEnd';
import { CampaignEX, MilestoneEX } from '@/types/types';
import {
    applyParamsToScript,
    Data,
    LucidEvolution,
    MintingPolicy,
    mintingPolicyToId,
    ScriptHash,
    Validator,
    validatorToAddress,
    validatorToScriptHash,
} from '@lucid-evolution/lucid';
import { bool } from 'aws-sdk/clients/signer';
import { ReactNode } from 'react';
import {
    BaseSmartDBEntity,
    BaseSmartDBFrontEndBtnHandlers,
    EmulatorEntity,
    explainErrorTx,
    formatHash,
    isEmulator,
    isNullOrBlank,
    IUseAppStore,
    IUseWalletStore,
    LUCID_NETWORK_MAINNET_NAME,
    LUCID_NETWORK_PREVIEW_NAME,
    LucidToolsFrontEnd,
    optionsGetMinimal,
    PROYECT_NAME,
    pushSucessNotification,
    pushWarningNotification,
    sleep,
    toJson,
    TX_PROPAGATION_DELAY_MS,
    WalletTxParams,
} from 'smart-db';
import { HandlesEnums, ModalsEnums, TaskEnums } from './constants/constants';
import { ADMIN_TOKEN_POLICY_CS, EMERGENCY_ADMIN_TOKEN_POLICY_CS, TxEnums } from './constants/on-chain';
import { CampaignStatus_Code_Id_Enums, SubmissionStatus_Enums } from './constants/status/status';
import { deleteFileFromS3, uploadMemberAvatarToS3 } from './s3Upload';
import { isBlobURL } from './utils';

export const processEntityListChanges = async <T extends { _DB_id?: string; campaign_id?: string }>(
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

    console.log(`processEntityListChanges`);

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
    appStore: IUseAppStore,
    walletStore: IUseWalletStore,
    openModal: (
        modal: ModalsEnums,
        data?: Record<string, any>,
        handles?: Partial<Record<HandlesEnums, (data?: Record<string, any>) => Promise<string | boolean | undefined | void>>>,
        component?: ReactNode
    ) => void,
    protocol: ProtocolEntity | undefined,
    campaign: CampaignEX,
    data?: Record<string, any>,
    onFinish?: (campaign: CampaignEX, data?: Record<string, any>) => Promise<void>
): Promise<string | undefined> {
    try {
        //--------------------------------------
        console.log(`serviceSaveCampaign`);
        //--------------------------------------
        if (appStore.isProcessingTx === true) {
            openModal(ModalsEnums.PROCESSING_TX);
            return;
        }
        if (appStore.isProcessingTask === true) {
            openModal(ModalsEnums.PROCESSING_TASK);
            return;
        }
        //--------------------------------------
        if (protocol === undefined) {
            console.error('Protocol is undefined');
            return;
        }
        //--------------------------------------
        let campaign_id = campaign.campaign._DB_id;
        //--------------------------------------
        appStore.setProcessingTaskName(TaskEnums.CREATE_CAMPAIGN);
        appStore.setShowProcessingTask(true);
        appStore.setIsProcessingTask(true);
        appStore.setIsConfirmedTask(false);
        appStore.setIsFaildedTask(false);
        //--------------------------------------
        if (isNullOrBlank(campaign.campaign._DB_id)) {
            appStore.setProcessingTaskMessage('Creating Campaign...');
        } else {
            appStore.setProcessingTaskMessage('Updating Campaign...');
        }
        //--------------------------------------
        openModal(ModalsEnums.PROCESSING_TASK);
        //--------------------------------------
        let entity = campaign.campaign;
        //--------------------------------------
        let allFilesToDelete: string[] = campaign.files_to_delete ? [...campaign.files_to_delete] : [];
        //--------------------------------------
        // SAVE CAMPAIGN
        //--------------------------------------
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
        //--------------------------------------
        if (isNullOrBlank(campaign.campaign._DB_id)) {
            //--------------------------------------
            entity = await CampaignApi.createApi(entity);
            //--------------------------------------
            campaign_id = entity._DB_id;
        } else {
            entity = await CampaignApi.updateWithParamsApi_(campaign.campaign._DB_id, entity);
        }
        //--------------------------------------
        // 🔹 Save FAQs
        const { savedEntities: savedFaqs, filesToDelete: faqFiles } = await processEntityListChanges(
            campaign_id,
            campaign.faqs,
            campaign.faqs_deleted,
            CampaignFaqsApi.updateWithParamsApi_.bind(CampaignFaqsApi),
            CampaignFaqsApi.createApi.bind(CampaignFaqsApi),
            CampaignFaqsApi.deleteByIdApi_.bind(CampaignFaqsApi),
            []
        );
        //--------------------------------------
        allFilesToDelete.push(...faqFiles);
        //--------------------------------------
        // 🔹 Save Contents
        const { savedEntities: savedContents, filesToDelete: contentFiles } = await processEntityListChanges(
            campaign_id,
            campaign.contents,
            campaign.contents_deleted,
            CampaignContentApi.updateWithParamsApi_.bind(CampaignContentApi),
            CampaignContentApi.createApi.bind(CampaignContentApi),
            CampaignContentApi.deleteByIdApi_.bind(CampaignContentApi),
            ['']
        );
        allFilesToDelete.push(...contentFiles);
        //--------------------------------------
        // 🔹 Save Members
        const { savedEntities: savedMembers, filesToDelete: memberFiles } = await processEntityListChanges(
            campaign_id,
            campaign.members,
            campaign.members_deleted,
            CampaignMemberApi.updateWithParamsApi_.bind(CampaignMemberApi),
            CampaignMemberApi.createApi.bind(CampaignMemberApi),
            CampaignMemberApi.deleteByIdApi_.bind(CampaignMemberApi),
            ['avatar_url']
        );
        //--------------------------------------
        allFilesToDelete.push(...memberFiles);
        //--------------------------------------
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
        //--------------------------------------
        const { savedEntities: savedMilestoneEntities, filesToDelete: milestoneFiles } = await processEntityListChanges(
            campaign_id,
            campaign.milestones?.map((m) => m.milestone),
            campaign.milestones_deleted?.map((m) => m.milestone),
            MilestoneApi.updateWithParamsApi_.bind(MilestoneApi),
            MilestoneApi.createApi.bind(MilestoneApi),
            MilestoneApi.deleteByIdApi_.bind(MilestoneApi),
            []
        );
        //--------------------------------------
        allFilesToDelete.push(...milestoneFiles);
        //--------------------------------------
        const milestoneMap = new Map((campaign.milestones || []).filter((m) => m.milestone._DB_id).map((m) => [m.milestone._DB_id!, m.milestone_submissions]));
        //--------------------------------------
        const savedMilestones: MilestoneEX[] = savedMilestoneEntities.map((milestoneEntity) => ({
            milestone: milestoneEntity,
            milestone_submissions: milestoneMap.get(milestoneEntity._DB_id!) || [],
        }));
        //--------------------------------------
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
        //--------------------------------------
        if (isNullOrBlank(campaign.campaign._DB_id)) {
            pushSucessNotification(`${PROYECT_NAME}`, 'Campaign created successfully', false);
        } else {
            pushSucessNotification(`${PROYECT_NAME}`, 'Campaign updated successfully', false);
        }
        //--------------------------------------
        appStore.setIsConfirmedTask(true);
        //--------------------------------------
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
    } catch (error) {
        console.log(`[${PROYECT_NAME}] - serviceSaveCampaign - Error: ${error}`);
        pushWarningNotification(`${PROYECT_NAME}`, `Error saving: ${error}`);
        appStore.setIsFaildedTask(true);
    } finally {
        appStore.setIsProcessingTask(false);
        appStore.setProcessingTaskMessage('');
    }
}

export async function serviceDeleteCampaign(
    appStore: IUseAppStore,
    walletStore: IUseWalletStore,
    openModal: (
        modal: ModalsEnums,
        data?: Record<string, any>,
        handles?: Partial<Record<HandlesEnums, (data?: Record<string, any>) => Promise<string | boolean | undefined | void>>>,
        component?: ReactNode
    ) => void,
    protocol: ProtocolEntity | undefined,
    campaign: CampaignEX,
    data?: Record<string, any>,
    onFinish?: (data?: Record<string, any>) => Promise<void>
): Promise<bool> {
    try {
        //--------------------------------------
        console.log(`serviceDeleteCampaign`);
        //--------------------------------------
        if (appStore.isProcessingTx === true) {
            openModal(ModalsEnums.PROCESSING_TX);
            return false;
        }
        if (appStore.isProcessingTask === true) {
            openModal(ModalsEnums.PROCESSING_TASK);
            return false;
        }
        //--------------------------------------
        if (protocol === undefined) {
            console.error('Protocol is undefined');
            return false;
        }
        //--------------------------------------
        let campaign_id = campaign.campaign._DB_id;
        //--------------------------------------
        appStore.setProcessingTaskName(TaskEnums.DELETE_CAMPAIGN);
        appStore.setShowProcessingTask(true);
        appStore.setIsProcessingTask(true);
        appStore.setIsConfirmedTask(false);
        appStore.setIsFaildedTask(false);
        //--------------------------------------
        if (isNullOrBlank(campaign.campaign._DB_id)) {
            throw new Error('Campaign ID is undefined');
        }
        //--------------------------------------
        openModal(ModalsEnums.PROCESSING_TASK);
        //--------------------------------------
        let entity = campaign.campaign;
        //--------------------------------------
        let allFilesToDelete: string[] = campaign.files_to_delete !== undefined ? campaign.files_to_delete : [];
        //--------------------------------------
        // DELETE CAMPAIGN
        //--------------------------------------
        // 🔁 Crear una copia mutable del objeto original
        campaign = {
            ...campaign,
            faqs_deleted: [...(campaign.faqs_deleted ?? []), ...(campaign.faqs ?? [])],
            contents_deleted: [...(campaign.contents_deleted ?? []), ...(campaign.contents ?? [])],
            members_deleted: [...(campaign.members_deleted ?? []), ...(campaign.members ?? [])],
            milestones_deleted: [...(campaign.milestones_deleted ?? []), ...(campaign.milestones ?? [])],
            faqs: [],
            contents: [],
            members: [],
            milestones: [],
        };
        //--------------------------------------
        const imageFields = ['banner_url', 'logo_url'];
        for (const field of imageFields) {
            const imageUrl = (entity as any)[field];
            if (!isNullOrBlank(imageUrl) && isBlobURL(imageUrl)) {
                try {
                    // const newImageUrl = await uploadMemberAvatarToS3(imageUrl);
                    // (entity as any)[field] = newImageUrl; // Update entity with new S3 URL
                    // URL.revokeObjectURL(imageUrl); // Revoke previous picture
                    allFilesToDelete.push(imageUrl);
                } catch (error) {
                    console.error(`Error uploading image for field "${field}" in entity ${entity._DB_id}:`, error);
                }
            }
        }
        //--------------------------------------
        // 🔹 Delete FAQs
        const { savedEntities: savedFaqs, filesToDelete: faqFiles } = await processEntityListChanges(
            campaign_id,
            campaign.faqs,
            campaign.faqs_deleted,
            CampaignFaqsApi.updateWithParamsApi_.bind(CampaignFaqsApi),
            CampaignFaqsApi.createApi.bind(CampaignFaqsApi),
            CampaignFaqsApi.deleteByIdApi_.bind(CampaignFaqsApi),
            []
        );
        //--------------------------------------
        allFilesToDelete.push(...faqFiles);
        //--------------------------------------
        // 🔹 Delete Contents
        const { savedEntities: savedContents, filesToDelete: contentFiles } = await processEntityListChanges(
            campaign_id,
            campaign.contents,
            campaign.contents_deleted,
            CampaignContentApi.updateWithParamsApi_.bind(CampaignContentApi),
            CampaignContentApi.createApi.bind(CampaignContentApi),
            CampaignContentApi.deleteByIdApi_.bind(CampaignContentApi),
            ['']
        );
        allFilesToDelete.push(...contentFiles);
        //--------------------------------------
        // 🔹 Delete Members
        const { savedEntities: savedMembers, filesToDelete: memberFiles } = await processEntityListChanges(
            campaign_id,
            campaign.members,
            campaign.members_deleted,
            CampaignMemberApi.updateWithParamsApi_.bind(CampaignMemberApi),
            CampaignMemberApi.createApi.bind(CampaignMemberApi),
            CampaignMemberApi.deleteByIdApi_.bind(CampaignMemberApi),
            ['avatar_url']
        );
        //--------------------------------------
        allFilesToDelete.push(...memberFiles);
        //--------------------------------------
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
        //--------------------------------------
        const { savedEntities: savedMilestoneEntities, filesToDelete: milestoneFiles } = await processEntityListChanges(
            campaign_id,
            campaign.milestones?.map((m) => m.milestone),
            campaign.milestones_deleted?.map((m) => m.milestone),
            MilestoneApi.updateWithParamsApi_.bind(MilestoneApi),
            MilestoneApi.createApi.bind(MilestoneApi),
            MilestoneApi.deleteByIdApi_.bind(MilestoneApi),
            []
        );
        //--------------------------------------
        allFilesToDelete.push(...milestoneFiles);
        //--------------------------------------
        const milestoneMap = new Map((campaign.milestones || []).filter((m) => m.milestone._DB_id).map((m) => [m.milestone._DB_id!, m.milestone_submissions]));
        //--------------------------------------
        const savedMilestones: MilestoneEX[] = savedMilestoneEntities.map((milestoneEntity) => ({
            milestone: milestoneEntity,
            milestone_submissions: milestoneMap.get(milestoneEntity._DB_id!) || [],
        }));
        //--------------------------------------
        // 🔹 **Final Cleanup: Delete All Files from S3**
        //--------------------------------------
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
        //--------------------------------------
        await CampaignApi.deleteByIdApi_(campaign.campaign._DB_id);
        //--------------------------------------
        pushSucessNotification(`${PROYECT_NAME}`, 'Campaign Deleted successfully', false);
        //--------------------------------------
        appStore.setIsConfirmedTask(true);
        //--------------------------------------
        if (onFinish !== undefined) {
            await onFinish(undefined);
        }
        //--------------------------------------
        return true;
        //--------------------------------------
    } catch (error) {
        console.log(`[${PROYECT_NAME}] - serviceSaveCampaign - Error: ${error}`);
        pushWarningNotification(`${PROYECT_NAME}`, `Error saving: ${error}`);
        appStore.setIsFaildedTask(true);
        return false;
    } finally {
        appStore.setIsProcessingTask(false);
        appStore.setProcessingTaskMessage('');
    }
}

export async function serviceFeatureCampaign(campaign: CampaignEX, data?: Record<string, any>, onFinish?: (campaign: CampaignEX, data?: Record<string, any>) => Promise<void>) {
    try {
        let entity = campaign.campaign;
        entity.featured = true;
        entity = await CampaignApi.updateWithParamsApi_(campaign.campaign._DB_id, entity);
        pushSucessNotification(`${PROYECT_NAME}`, 'Updated successfully', false);
        if (onFinish !== undefined) {
            await onFinish(campaign, data);
        }
    } catch (e) {
        console.error(e);
        pushWarningNotification(`${PROYECT_NAME}`, `Error updating: ${e}`);
    }
}

export async function serviceUnFeatureCampaign(campaign: CampaignEX, data?: Record<string, any>, onFinish?: (campaign: CampaignEX, data?: Record<string, any>) => Promise<void>) {
    try {
        let entity = campaign.campaign;
        entity.featured = false;
        entity = await CampaignApi.updateWithParamsApi_(campaign.campaign._DB_id, entity);
        pushSucessNotification(`${PROYECT_NAME}`, 'Updated successfully', false);
        if (onFinish !== undefined) {
            await onFinish(campaign, data);
        }
    } catch (e) {
        console.error(e);
        pushWarningNotification(`${PROYECT_NAME}`, `Error updating: ${e}`);
    }
}

export async function serviceArchiveCampaign(campaign: CampaignEX, data?: Record<string, any>, onFinish?: (campaign: CampaignEX, data?: Record<string, any>) => Promise<void>) {
    try {
        let entity = campaign.campaign;
        entity.archived = true;
        entity = await CampaignApi.updateWithParamsApi_(campaign.campaign._DB_id, entity);
        pushSucessNotification(`${PROYECT_NAME}`, 'Updated successfully', false);
        if (onFinish !== undefined) {
            await onFinish(campaign, data);
        }
    } catch (e) {
        console.error(e);
        pushWarningNotification(`${PROYECT_NAME}`, `Error updating: ${e}`);
    }
}

export async function serviceUnArchiveCampaign(campaign: CampaignEX, data?: Record<string, any>, onFinish?: (campaign: CampaignEX, data?: Record<string, any>) => Promise<void>) {
    try {
        let entity = campaign.campaign;
        entity.archived = false;
        entity = await CampaignApi.updateWithParamsApi_(campaign.campaign._DB_id, entity);
        pushSucessNotification(`${PROYECT_NAME}`, 'Updated successfully', false);
        if (onFinish !== undefined) {
            await onFinish(campaign, data);
        }
    } catch (e) {
        console.error(e);
        pushWarningNotification(`${PROYECT_NAME}`, `Error updating: ${e}`);
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
        pushSucessNotification(`${PROYECT_NAME}`, 'Updated successfully', false);
        if (onFinish !== undefined) {
            await onFinish(campaign, data);
        }
    } catch (e) {
        console.error(e);
        pushWarningNotification(`${PROYECT_NAME}`, `Error updating: ${e}`);
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
        pushSucessNotification(`${PROYECT_NAME}`, 'Updated successfully', false);
        if (onFinish !== undefined) {
            await onFinish(campaign, data);
        }
    } catch (e) {
        console.error(e);
        pushWarningNotification(`${PROYECT_NAME}`, `Error updating: ${e}`);
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
        pushSucessNotification(`${PROYECT_NAME}`, 'Updated successfully', false);
        if (onFinish !== undefined) {
            await onFinish(campaign, data);
        }
    } catch (e) {
        console.error(e);
        pushWarningNotification(`${PROYECT_NAME}`, `Error updating: ${e}`);
    }
}

export async function serviceCreateSmartContracts(
    appStore: IUseAppStore,
    walletStore: IUseWalletStore,
    openModal: (
        modal: ModalsEnums,
        data?: Record<string, any>,
        handles?: Partial<Record<HandlesEnums, (data?: Record<string, any>) => Promise<string | boolean | undefined | void>>>,
        component?: ReactNode
    ) => void,
    protocol: ProtocolEntity | undefined,
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
        //--------------------------------------
        console.log(`serviceCreateSmartContracts`);
        //--------------------------------------
        if (appStore.isProcessingTx === true) {
            openModal(ModalsEnums.PROCESSING_TX);
            return false;
        }
        if (appStore.isProcessingTask === true) {
            openModal(ModalsEnums.PROCESSING_TASK);
            return false;
        }
        //--------------------------------------
        if (protocol === undefined) {
            console.error('Protocol is undefined');
            return;
        }
        //--------------------------------------
        let campaign_id = campaign.campaign._DB_id;
        //--------------------------------------
        appStore.setProcessingTaskName(TaskEnums.CREATE_CONTRACTS_CAMPAIGN);
        appStore.setShowProcessingTask(true);
        appStore.setIsProcessingTask(true);
        appStore.setIsConfirmedTask(false);
        appStore.setIsFaildedTask(false);
        //--------------------------------------
        openModal(ModalsEnums.PROCESSING_TASK);
        //--------------------------------------
        const { lucid, emulatorDB, walletTxParams } = await LucidToolsFrontEnd.prepareLucidFrontEndForTx(walletStore);
        //--------------------------------------
        const campaignFactory = protocol.fdpCampaignFactories[0];
        //--------------------------------------
        // Campaign Validator
        const ParamsSchemaCampaignValidator = Data.Tuple([Data.Bytes(), Data.Bytes()]);
        type ParamsCampaignValidator = Data.Static<typeof ParamsSchemaCampaignValidator>;
        //--------------------------------------
        const fdpCampaignValidator_Params = {
            protocolPolicyID_CS: protocol.getNET_id_CS(),
            tokenEmergencyAdminPolicy_CS: EMERGENCY_ADMIN_TOKEN_POLICY_CS,
        };
        //--------------------------------------
        const fdpCampaignValidator_Script: Validator = {
            type: 'PlutusV2',
            script: applyParamsToScript<ParamsCampaignValidator>(
                campaignFactory.fdpCampaignValidator_Pre_CborHex.script,
                [fdpCampaignValidator_Params.protocolPolicyID_CS, fdpCampaignValidator_Params.tokenEmergencyAdminPolicy_CS],
                ParamsSchemaCampaignValidator as unknown as ParamsCampaignValidator
            ),
        };
        //--------------------------------------
        const fdpCampaignValidator_Hash = validatorToScriptHash(fdpCampaignValidator_Script);
        console.log(`fdpCampaignValidator_Hash ${fdpCampaignValidator_Hash}`);
        //--------------------------------------
        const fdpCampaignValidator_AddressTestnet = validatorToAddress(LUCID_NETWORK_PREVIEW_NAME, fdpCampaignValidator_Script);
        console.log(`fdpCampaignValidator_AddressTestnet ${fdpCampaignValidator_AddressTestnet}`);
        const fdpCampaignValidator_AddressMainnet = validatorToAddress(LUCID_NETWORK_MAINNET_NAME, fdpCampaignValidator_Script);
        console.log(`fdpCampaignValidator_AddressMainnet ${fdpCampaignValidator_AddressMainnet}`);
        //--------------------------------------
        if (walletTxParams.utxos.length === 0) {
            throw new Error('No UTxOs found in the wallet');
        }
        const uTxO = walletTxParams.utxos[0];
        //--------------------------------------
        const campaign_TxHash = uTxO.txHash;
        const campaign_TxOutputIndex = uTxO.outputIndex;
        //--------------------------------------
        // Campaign Policy
        //--------------------------------------
        const ParamsSchemaCampaignPolicy = Data.Tuple([Data.Bytes(), Data.Bytes(), Data.Integer(), Data.Bytes()]);
        type ParamsCampaignPolicy = Data.Static<typeof ParamsSchemaCampaignPolicy>;
        //--------------------------------------
        const fdpCampaignPolicy_Params = {
            protocolPolicy_CS: protocol.getNET_id_CS(),
            campaign_TxHash: campaign_TxHash,
            campaign_TxOutputIndex: BigInt(campaign_TxOutputIndex),
            campaignValidator_Hash: fdpCampaignValidator_Hash,
        };
        //--------------------------------------
        const fdpCampaignPolicy_Script: MintingPolicy = {
            type: 'PlutusV2',
            script: applyParamsToScript<ParamsCampaignPolicy>(
                campaignFactory.fdpCampaignPolicy_Pre_CborHex.script,
                [
                    fdpCampaignPolicy_Params.protocolPolicy_CS,
                    fdpCampaignPolicy_Params.campaign_TxHash,
                    fdpCampaignPolicy_Params.campaign_TxOutputIndex,
                    fdpCampaignPolicy_Params.campaignValidator_Hash,
                ],
                ParamsSchemaCampaignPolicy as unknown as ParamsCampaignPolicy
            ),
        };
        //--------------------------------------
        const fdpCampaignPolicy_CS = mintingPolicyToId(fdpCampaignPolicy_Script);
        console.log(`fdpCampaignPolicy_CS ${fdpCampaignPolicy_CS}`);
        //--------------------------------------
        // CampaignFunds Validator
        //--------------------------------------
        const ParamsSchemaCampaignFundsValidator = Data.Tuple([Data.Bytes(), Data.Bytes()]);
        type ParamsCampaignFundsValidator = Data.Static<typeof ParamsSchemaCampaignFundsValidator>;
        //--------------------------------------
        const fdpCampaignFundsValidator_Params = {
            protocolPolicyID_CS: protocol.getNET_id_CS(),
            tokenEmergencyAdminPolicy_CS: EMERGENCY_ADMIN_TOKEN_POLICY_CS,
        };
        //--------------------------------------
        const fdpCampaignFundsValidator_Script: Validator = {
            type: 'PlutusV2',
            script: applyParamsToScript<ParamsCampaignFundsValidator>(
                campaignFactory.fdpCampaignFundsValidator_Pre_CborHex.script,
                [fdpCampaignFundsValidator_Params.protocolPolicyID_CS, fdpCampaignFundsValidator_Params.tokenEmergencyAdminPolicy_CS],
                ParamsSchemaCampaignFundsValidator as unknown as ParamsCampaignFundsValidator
            ),
        };
        //--------------------------------------
        const fdpCampaignFundsValidator_Hash = validatorToScriptHash(fdpCampaignFundsValidator_Script);
        console.log(`fdpCampaignFundsValidator_Hash ${fdpCampaignFundsValidator_Hash}`);
        //--------------------------------------
        const fdpCampaignFundsValidator_AddressTestnet = validatorToAddress(LUCID_NETWORK_PREVIEW_NAME, fdpCampaignFundsValidator_Script);
        console.log(`fdpCampaignFundsValidator_AddressTestnet ${fdpCampaignFundsValidator_AddressTestnet}`);
        const fdpCampaignFundsValidator_AddressMainnet = validatorToAddress(LUCID_NETWORK_MAINNET_NAME, fdpCampaignFundsValidator_Script);
        console.log(`fdpCampaignFundsValidator_AddressMainnet ${fdpCampaignFundsValidator_AddressMainnet}`);
        //--------------------------------------
        // CampaignFunds Policy
        //--------------------------------------
        const ParamsSchemaCampaignFundsPolicyID = Data.Tuple([Data.Bytes(), Data.Bytes()]);
        type ParamsCampaignFundsPolicy = Data.Static<typeof ParamsSchemaCampaignFundsPolicyID>;
        //--------------------------------------
        const fdpCampaignFundsPolicyID_Params = {
            campaignPolicy_CS: fdpCampaignPolicy_CS,
            campaignFundsValidator_Hash: fdpCampaignFundsValidator_Hash,
        };
        //--------------------------------------
        const fdpCampaignFundsPolicyID_Script: MintingPolicy = {
            type: 'PlutusV2',
            script: applyParamsToScript<ParamsCampaignFundsPolicy>(
                campaignFactory.fdpCampaignFundsPolicyID_Pre_CborHex.script,
                [fdpCampaignFundsPolicyID_Params.campaignPolicy_CS, fdpCampaignFundsPolicyID_Params.campaignFundsValidator_Hash],
                ParamsSchemaCampaignFundsPolicyID as unknown as ParamsCampaignFundsPolicy
            ),
        };
        //--------------------------------------
        const fdpCampaignFundsPolicyID_CS = mintingPolicyToId(fdpCampaignFundsPolicyID_Script);
        console.log(`fdpCampaignFundsPolicyID_CS ${fdpCampaignFundsPolicyID_CS}`);
        //--------------------------------------
        let entity = campaign.campaign;
        //--------------------------------------
        const status = campaignStatus.find((status) => status.code_id === CampaignStatus_Code_Id_Enums.CONTRACT_CREATED);
        if (!status) {
            throw new Error(`Status CONTRACT_CREATED code-id: ${CampaignStatus_Code_Id_Enums.CONTRACT_CREATED} not found`);
        }
        //--------------------------------------
        entity.fdpCampaignVersion = campaignFactory.fdpCampaignVersion;
        entity.fdpCampaignPolicy_Params = fdpCampaignPolicy_Params;
        entity.fdpCampaignPolicy_Script = fdpCampaignPolicy_Script;
        entity.fdpCampaignPolicy_CS = fdpCampaignPolicy_CS;
        entity.fdpCampaignValidator_AddressMainnet = fdpCampaignValidator_AddressMainnet;
        entity.fdpCampaignValidator_AddressTestnet = fdpCampaignValidator_AddressTestnet;
        entity.fdpCampaignValidator_Script = fdpCampaignValidator_Script;
        entity.fdpCampaignValidator_Hash = fdpCampaignValidator_Hash;
        entity.fdpCampaignValidator_Params = fdpCampaignValidator_Params;
        entity.fdpCampaignFundsPolicyID_Params = fdpCampaignFundsPolicyID_Params;
        entity.fdpCampaignFundsPolicyID_Script = fdpCampaignFundsPolicyID_Script;
        entity.fdpCampaignFundsPolicyID_CS = fdpCampaignFundsPolicyID_CS;
        entity.fdpCampaignFundsValidator_Params = fdpCampaignFundsValidator_Params;
        entity.fdpCampaignFundsValidator_Hash = fdpCampaignFundsValidator_Hash;
        entity.fdpCampaignFundsValidator_Script = fdpCampaignFundsValidator_Script;
        entity.fdpCampaignFundsValidator_AddressTestnet = fdpCampaignFundsValidator_AddressTestnet;
        entity.fdpCampaignFundsValidator_AddressMainnet = fdpCampaignFundsValidator_AddressMainnet;
        //--------------------------------------
        entity._NET_address = entity.getNet_Address();
        entity._NET_id_CS = entity.getNET_id_CS();
        //--------------------------------------
        entity.campaign_status_id = status._DB_id;
        //--------------------------------------
        entity = await CampaignApi.updateWithParamsApi_(campaign.campaign._DB_id, entity);
        //--------------------------------------
        await CampaignApi.createHookApi<CampaignEntity>(CampaignEntity, entity.getNet_Address(), entity.getNET_id_CS());
        await CampaignApi.createHookApi<CampaignFundsEntity>(CampaignFundsEntity, entity.getNet_FundHolding_Validator_Address(), entity.getNet_FundHoldingPolicyID_CS());
        //--------------------------------------
        pushSucessNotification(`${PROYECT_NAME}`, 'Created Contracts successfully', false);
        //--------------------------------------
        appStore.setIsConfirmedTask(true);
        //--------------------------------------
        const campaignEX: CampaignEX = {
            campaign: entity,
            faqs: campaign.faqs,
            contents: campaign.contents,
            members: campaign.members,
            campaign_submissions: campaign.campaign_submissions,
            milestones: campaign.milestones,
        };
        if (onFinish !== undefined) {
            await onFinish(campaignEX, data);
        }
        return entity._DB_id;
    } catch (error) {
        console.log(`[${PROYECT_NAME}] - serviceCreateSmartContracts - Error: ${error}`);
        pushWarningNotification(`${PROYECT_NAME}`, `Error Creating Contracts: ${error}`);
        appStore.setIsFaildedTask(true);
    } finally {
        appStore.setIsProcessingTask(false);
        appStore.setProcessingTaskMessage('');
    }
}

export async function servicePublishSmartContracts(
    appStore: IUseAppStore,
    walletStore: IUseWalletStore,
    openModal: (
        modal: ModalsEnums,
        data?: Record<string, any>,
        handles?: Partial<Record<HandlesEnums, (data?: Record<string, any>) => Promise<string | boolean | undefined | void>>>,
        component?: ReactNode
    ) => void,
    protocol: ProtocolEntity | undefined,
    campaign: CampaignEX,
    campaignStatus: CampaignStatusEntity[],
    data?: Record<string, any>,
    onFinish?: (campaign: CampaignEX, data?: Record<string, any>) => Promise<void>
) {
    try {
        //--------------------------------------
        // Publish Campaign Contracts (TX)
        // Descripción: Despliega los contratos de la campaña en la blockchain
        // Estado Inicial DB: Contract Created
        // Estado Final DB: Contract Published
        // Ejecuta: Protocol Team, Campaign Managers
        //--------------------------------------
        console.log(`servicePublishSmartContracts`);
        //--------------------------------------
        if (appStore.isProcessingTx === true) {
            openModal(ModalsEnums.PROCESSING_TX);
            return;
        }
        if (appStore.isProcessingTask === true) {
            openModal(ModalsEnums.PROCESSING_TASK);
            return;
        }
        //--------------------------------------
        if (protocol === undefined) {
            console.error('Protocol is undefined');
            return;
        }
        //--------------------------------------
        let campaign_id = campaign.campaign._DB_id;
        //--------------------------------------
        appStore.setProcessingTxName(TxEnums.SCRIPTS_ADD);
        appStore.setShowProcessingTx(true);
        appStore.setIsProcessingTx(true);
        appStore.setIsConfirmedTx(false);
        appStore.setIsFaildedTx(false);
        //--------------------------------------
        appStore.setProcessingTxMessage('Adding Campaign Scripts...');
        appStore.setProcessingTxHash('');
        openModal(ModalsEnums.PROCESSING_TX);
        //--------------------------------------
        const { lucid, emulatorDB, walletTxParams } = await LucidToolsFrontEnd.prepareLucidFrontEndForTx(walletStore);
        //--------------------------------------
        const campaignWithScripts: CampaignEntity | undefined = await CampaignApi.getByIdApi_(campaign.campaign._DB_id, {
            ...optionsGetMinimal,
            fieldsForSelect: CampaignEntity.defaultFieldsAddScriptsTxScript,
        });
        if (campaignWithScripts === undefined) {
            throw `Invalid campaign id`;
        }
        //--------------------------------------
        const txParams: CampaignAddScriptsTxParams = {
            protocol_id: protocol!._DB_id!,
            campaign_id: campaign_id,
        };
        //--------------------------------------
        const scriptsToAdd = [
            { hash: campaignWithScripts.fdpCampaignPolicy_CS, script: campaignWithScripts.fdpCampaignPolicy_Script },
            { hash: campaignWithScripts.fdpCampaignValidator_Hash, script: campaignWithScripts.fdpCampaignValidator_Hash },
            { hash: campaignWithScripts.fdpCampaignFundsPolicyID_CS, script: campaignWithScripts.fdpCampaignFundsPolicyID_Script },
            { hash: campaignWithScripts.fdpCampaignFundsValidator_Hash, script: campaignWithScripts.fdpCampaignFundsValidator_Script },
        ];
        //--------------------------------------
        for (let index = 0; index < scriptsToAdd.length; index++) {
            //--------------------------------------
            const scriptToAdd = scriptsToAdd[index];
            //--------------------------------------
            const script_Hash: ScriptHash = scriptToAdd.hash;
            //--------------------------------------
            console.log(`${CampaignEntity.className()} - servicePublishSmartContracts - Adding Script: ${script_Hash}`);
            //--------------------------------------
            const script = await ScriptApi.getByHashApi(script_Hash);
            if (script !== undefined) {
                console.log(`${CampaignEntity.className()} - servicePublishSmartContracts - Skipping script: ${script_Hash}, it's already added`);
            } else {
                appStore.setProcessingTxMessage(`Script (${index + 1}/${scriptsToAdd.length}): Adding ${formatHash(script_Hash)}...`);
                //--------------------------------------
                const { txCborHex } = await ScriptApi.addCampaignScriptTxApi(walletTxParams, { script_Hash, ...txParams });
                //--------------------------------------
                appStore.setProcessingTxMessage(`Script (${index + 1}/${scriptsToAdd.length}): Transaction prepared, waiting for sign to submit...`);
                //--------------------------------------
                const txHash = await LucidToolsFrontEnd.signAndSubmitTx(lucid, txCborHex, walletStore.info, emulatorDB, walletStore.swDoNotPromtForSigning);
                //--------------------------------------
                appStore.setProcessingTxMessage(`Script (${index + 1}/${scriptsToAdd.length}): Transaction submitted, waiting for confirmation...`);
                appStore.setProcessingTxHash(txHash);
                //--------------------------------------
                if (await LucidToolsFrontEnd.awaitTx(lucid, txHash)) {
                    console.log(`${CampaignEntity.className()} - servicePublishSmartContracts - waitForTxConfirmation - Tx confirmed - ${txHash}`);
                    //--------------------------------------
                    appStore.setProcessingTxMessage(`Script (${index + 1}/${scriptsToAdd.length}): Syncronizing...`);
                    //--------------------------------------
                    pushSucessNotification(`${CampaignEntity.className()} Add Script Tx`, txHash, true);
                } else {
                    console.log(`${CampaignEntity.className()} - servicePublishSmartContracts - waitForTxConfirmation - Tx not confirmed - ${txHash}`);
                    // throw `Tx not confirmed`
                }
                //--------------------------------------
                if (!isEmulator) {
                    // como estoy haciendo mas de una tx y no quiero hacer todo el proceso de update wallet salvar emulador, si no hacerlo solo una vez al final,
                    // tengo que actualizar al menos las utxos de la wallet aqui de forma manual
                    // espero un poco para que se actualicen las utxos
                    await sleep(TX_PROPAGATION_DELAY_MS);
                }
                walletTxParams.utxos = await lucid.wallet().getUtxos();
                //--------------------------------------
            }
        }
        //--------------------------------------
        // Actualizo el status de la campaña a CONTRACT_PUBLISHED
        const status = campaignStatus.find((status) => status.code_id === CampaignStatus_Code_Id_Enums.CONTRACT_PUBLISHED);
        if (!status) {
            throw new Error(`Status CONTRACT_PUBLISHED code-id: ${CampaignStatus_Code_Id_Enums.CONTRACT_PUBLISHED} not found`);
        }
        let entity = campaign.campaign;
        entity.campaign_status_id = status._DB_id;
        entity = await CampaignApi.updateWithParamsApi_(campaign.campaign._DB_id, entity);
        //--------------------------------------
        pushSucessNotification(`${CampaignEntity.className()} Add Script Tx`, 'Completed', false);
        //--------------------------------------
        await walletStore.loadWalletData();
        //--------------------------------------
        appStore.setIsConfirmedTx(true);
        //--------------------------------------
        if (onFinish !== undefined) {
            await onFinish(campaign, data);
        }
        return true;
    } catch (error) {
        const error_explained = explainErrorTx(error);
        console.log(`[${CampaignEntity.className()}] - servicePublishSmartContracts - Error: ${error_explained}`);
        pushWarningNotification(`${CampaignEntity.className()} Add Scripts Tx`, error_explained);
        appStore.setProcessingTxMessage(error_explained);
        appStore.setIsFaildedTx(true);
        return false;
    } finally {
        appStore.setIsProcessingTx(false);
        appStore.setProcessingTxMessage('');
        appStore.setProcessingTxHash('');
    }
}

export async function serviceInitializeCampaign(
    appStore: IUseAppStore,
    walletStore: IUseWalletStore,
    openModal: (
        modal: ModalsEnums,
        data?: Record<string, any>,
        handles?: Partial<Record<HandlesEnums, (data?: Record<string, any>) => Promise<string | boolean | undefined | void>>>,
        component?: ReactNode
    ) => void,
    protocol: ProtocolEntity | undefined,
    handleBtnDoTransaction_WithErrorControl: (
        Entity: typeof BaseSmartDBEntity,
        modalTitleTx: string,
        messageActionTx: string,
        txApiRoute: string,
        fetchParams: () => Promise<{
            lucid: LucidEvolution;
            emulatorDB: EmulatorEntity | undefined;
            walletTxParams: WalletTxParams;
            txParams: any;
        }>,
        txApiCall: (Entity: typeof BaseSmartDBEntity, txApiRoute: string, walletTxParams: WalletTxParams, txParams: any) => Promise<any>,
        handleBtnTxNoErrorControl: (
            Entity: typeof BaseSmartDBEntity,
            modalTitleTx: string,
            messageActionTx: string,
            lucid: LucidEvolution,
            emulatorDB: EmulatorEntity | undefined,
            apiTxCall: () => Promise<any>,
            setProcessingTxMessage: (processingTxMessage: string) => void,
            setProcessingTxHash: (processingTxHash: string) => void,
            walletStore: IUseWalletStore
        ) => Promise<void>,
        onTx?: (() => Promise<void>) | undefined
    ) => Promise<void>,
    campaign: CampaignEX,
    campaignStatus: CampaignStatusEntity[],
    data?: Record<string, any>,
    onFinish?: (campaign: CampaignEX, data?: Record<string, any>) => Promise<void>
) {
    try {
        //--------------------------------------
        // Initialize Campaign Contracts (TX)
        // Descripción: Crea el datum inicial de la campaña en la blockchain
        // Estado Inicial DB: Contract Published (Milestones: Not Started)
        // Estado Final DB: Contract Started (Milestones: Not Started)
        // Estado Inicial Datum: N/A (Milestones: N/A)
        // Estado Final Datum: CsCreated (Milestones: MsCreated)
        // Ejecuta: Protocol Team
        //--------------------------------------
        console.log(`serviceInitializeCampaign`);
        //--------------------------------------
        if (appStore.isProcessingTx === true) {
            openModal(ModalsEnums.PROCESSING_TX);
            return;
        }
        if (appStore.isProcessingTask === true) {
            openModal(ModalsEnums.PROCESSING_TASK);
            return;
        }
        //--------------------------------------
        if (protocol === undefined) {
            console.error('Protocol is undefined');
            return;
        }
        if (campaign.campaign.campaignToken_PriceADA === undefined || campaign.campaign.campaignToken_PriceADA === 0n) {
            alert('Must set Token Price');
            return;
        }
        if (campaign.campaign.mint_CampaignToken === false && (isNullOrBlank(campaign.campaign.campaignToken_CS) || isNullOrBlank(campaign.campaign.campaignToken_TN))) {
            alert('When providing your own Token, you must set Token Policy and Token Name');
            return;
        }
        if (data?.beginAt === undefined || data?.deadline === undefined || data?.beginAt === '' || data?.deadline === '') {
            alert('Must set From and To');
            return;
        }
        //--------------------------------------
        let campaign_id = campaign.campaign._DB_id;
        //--------------------------------------
        const fetchParams = async () => {
            //--------------------------------------
            const { lucid, emulatorDB, walletTxParams } = await LucidToolsFrontEnd.prepareLucidFrontEndForTx(walletStore);
            //--------------------------------------
            const txParams: CampaignDeployTxParams = {
                protocol_id: protocol!._DB_id!,
                campaign_id,
                cdTokenAdminPolicy_CS: ADMIN_TOKEN_POLICY_CS,
                beginAt: data?.beginAt,
                deadline: data?.deadline,
            };
            return {
                lucid,
                emulatorDB,
                walletTxParams,
                txParams,
            };
        };
        //--------------------------------------
        openModal(ModalsEnums.PROCESSING_TX);
        //--------------------------------------
        const txApiCall = CampaignApi.callGenericTxApi.bind(CampaignApi);
        const handleBtnTx = BaseSmartDBFrontEndBtnHandlers.handleBtnDoTransaction_V2_NoErrorControl.bind(BaseSmartDBFrontEndBtnHandlers);
        //--------------------------------------
        const onTx = async () => {
            appStore.setProcessingTxMessage(`Updating status......`);
            // const status = campaignStatus.find((status) => status.code_id === CampaignStatus_Code_Id_Enums.CONTRACT_STARTED);
            // if (!status) {
            //     throw new Error(`Status CONTRACT_STARTED code-id: ${CampaignStatus_Code_Id_Enums.CONTRACT_STARTED} not found`);
            // }
            // const campaign_status_id = status._DB_id;
            const campaign_deployed_date = new Date();
            await CampaignApi.updateWithParamsApi_(campaign.campaign._DB_id, { campaign_deployed_date });
        };
        //--------------------------------------
        await handleBtnDoTransaction_WithErrorControl(CampaignEntity, TxEnums.CAMPAIGN_DEPLOY, 'Deploying Campaign...', 'deploy-tx', fetchParams, txApiCall, handleBtnTx, onTx);
        //--------------------------------------
        if (onFinish !== undefined) {
            await onFinish(campaign, data);
        }
        //--------------------------------------
    } catch (e) {
        console.error(e);
        pushWarningNotification(`${PROYECT_NAME}`, `Error updating: ${e}`);
    }
}

export async function servicePrepareUTxOs(
    appStore: IUseAppStore,
    walletStore: IUseWalletStore,
    openModal: (
        modal: ModalsEnums,
        data?: Record<string, any>,
        handles?: Partial<Record<HandlesEnums, (data?: Record<string, any>) => Promise<string | boolean | undefined | void>>>,
        component?: ReactNode
    ) => void,
    protocol: ProtocolEntity | undefined,
    handleBtnDoTransaction_WithErrorControl: (
        Entity: typeof BaseSmartDBEntity,
        modalTitleTx: string,
        messageActionTx: string,
        txApiRoute: string,
        fetchParams: () => Promise<{
            lucid: LucidEvolution;
            emulatorDB: EmulatorEntity | undefined;
            walletTxParams: WalletTxParams;
            txParams: any;
        }>,
        txApiCall: (Entity: typeof BaseSmartDBEntity, txApiRoute: string, walletTxParams: WalletTxParams, txParams: any) => Promise<any>,
        handleBtnTxNoErrorControl: (
            Entity: typeof BaseSmartDBEntity,
            modalTitleTx: string,
            messageActionTx: string,
            lucid: LucidEvolution,
            emulatorDB: EmulatorEntity | undefined,
            apiTxCall: () => Promise<any>,
            setProcessingTxMessage: (processingTxMessage: string) => void,
            setProcessingTxHash: (processingTxHash: string) => void,
            walletStore: IUseWalletStore
        ) => Promise<void>,
        onTx?: (() => Promise<void>) | undefined
    ) => Promise<void>,
    campaign: CampaignEX,
    campaignStatus: CampaignStatusEntity[],
    data?: Record<string, any>,
    onFinish?: (campaign: CampaignEX, data?: Record<string, any>) => Promise<void>
) {
    try {
        //--------------------------------------
        // Prepare UTXxO (TX)
        // Descripción: Crea UTXO de Campaign Fund, mintea tokens y los agrega a la utxo, son 3 tx
        //--------------------------------------
        console.log(`servicePrepareUTxOs`);
        //--------------------------------------
        if (appStore.isProcessingTx === true) {
            openModal(ModalsEnums.PROCESSING_TX);
            return;
        }
        if (appStore.isProcessingTask === true) {
            openModal(ModalsEnums.PROCESSING_TASK);
            return;
        }
        //--------------------------------------
        if (protocol === undefined) {
            console.error('Protocol is undefined');
            return;
        }
        //--------------------------------------
        let campaign_id = campaign.campaign._DB_id;
        //--------------------------------------
        let campaignFunds: CampaignFundsEntity[] | undefined = await CampaignFundsApi.getByParamsApi_(
            { cfdCampaignPolicy_CS: campaign.campaign.getNET_id_CS() },
            {
                loadRelations: { smartUTxO_id: true },
            }
        );
        //--------------------------------------
        if (campaignFunds.length === 0) {
            //--------------------------------------
            const fetchParams = async () => {
                //--------------------------------------
                const { lucid, emulatorDB, walletTxParams } = await LucidToolsFrontEnd.prepareLucidFrontEndForTx(walletStore);
                //--------------------------------------
                const txParams: CampaignFundsAddTxParams = {
                    protocol_id: protocol!._DB_id!,
                    campaign_id,
                };
                return {
                    lucid,
                    emulatorDB,
                    walletTxParams,
                    txParams,
                };
            };
            //--------------------------------------
            openModal(ModalsEnums.PROCESSING_TX);
            //--------------------------------------
            const txApiCall = CampaignApi.callGenericTxApi.bind(CampaignApi);
            const handleBtnTx = BaseSmartDBFrontEndBtnHandlers.handleBtnDoTransaction_V2_NoErrorControl.bind(BaseSmartDBFrontEndBtnHandlers);
            //--------------------------------------
            const onTx = async () => {};
            //--------------------------------------
            await handleBtnDoTransaction_WithErrorControl(
                CampaignEntity,
                TxEnums.CAMPAIGN_ADD_FUND,
                'Campaign Adding Fund...',
                'campaign-fund-add-tx',
                fetchParams,
                txApiCall,
                handleBtnTx,
                onTx
            );
            //--------------------------------------
            if (onFinish !== undefined) {
                await onFinish(campaign, data);
            }
            //--------------------------------------
        }
        //--------------------------------------
        campaignFunds = await CampaignFundsApi.getByParamsApi_(
            { cfdCampaignPolicy_CS: campaign.campaign.getNET_id_CS() },
            {
                loadRelations: { smartUTxO_id: true },
            }
        );
        //--------------------------------------
        if (campaignFunds.length === 1 && campaignFunds[0].cfdSubtotal_Avalaible_CampaignToken === 0n) {
            //--------------------------------------
            const fetchParams = async () => {
                //--------------------------------------
                const { lucid, emulatorDB, walletTxParams } = await LucidToolsFrontEnd.prepareLucidFrontEndForTx(walletStore);
                //--------------------------------------
                const txParams: CampaignFundsMintDepositTxParams = {
                    protocol_id: protocol!._DB_id!,
                    campaign_id,
                    campaign_funds_id: campaignFunds[0]._DB_id,
                };
                return {
                    lucid,
                    emulatorDB,
                    walletTxParams,
                    txParams,
                };
            };
            //--------------------------------------
            openModal(ModalsEnums.PROCESSING_TX);
            //--------------------------------------
            const txApiCall = CampaignApi.callGenericTxApi.bind(CampaignApi);
            const handleBtnTx = BaseSmartDBFrontEndBtnHandlers.handleBtnDoTransaction_V2_NoErrorControl.bind(BaseSmartDBFrontEndBtnHandlers);
            //--------------------------------------
            const onTx = async () => {};
            //--------------------------------------
            await handleBtnDoTransaction_WithErrorControl(
                CampaignEntity,
                TxEnums.CAMPAIGN_FUNDS_MINT_DEPOSIT,
                'Campaign Fund Mint & Deposit...',
                'campaign-fund-mint-deposit-tx',
                fetchParams,
                txApiCall,
                handleBtnTx,
                onTx
            );
            //--------------------------------------
            if (onFinish !== undefined) {
                await onFinish(campaign, data);
            }
            //--------------------------------------
            return;
        }
        //--------------------------------------
        appStore.setProcessingTxName(TxEnums.CAMPAIGN_ADD_FUND);
        appStore.setShowProcessingTx(true);
        appStore.setIsProcessingTx(true);
        appStore.setIsConfirmedTx(false);
        appStore.setIsFaildedTx(false);
        //--------------------------------------
        appStore.setProcessingTxMessage('Adding Campaign Funds...');
        appStore.setProcessingTxHash('');
        openModal(ModalsEnums.PROCESSING_TX);
        //--------------------------------------
        pushSucessNotification(`${CampaignEntity.className()} Fund Add Tx`, 'Completed', false);
        //--------------------------------------
        await walletStore.loadWalletData();
        //--------------------------------------
        appStore.setIsConfirmedTx(true);
        appStore.setIsProcessingTx(false);
        //--------------------------------------
    } catch (e) {
        console.error(e);
        pushWarningNotification(`${PROYECT_NAME}`, `Error updating: ${e}`);
    }
}

export async function serviceLaunchCampaign(
    appStore: IUseAppStore,
    walletStore: IUseWalletStore,
    openModal: (
        modal: ModalsEnums,
        data?: Record<string, any>,
        handles?: Partial<Record<HandlesEnums, (data?: Record<string, any>) => Promise<string | boolean | undefined | void>>>,
        component?: ReactNode
    ) => void,
    protocol: ProtocolEntity | undefined,
    handleBtnDoTransaction_WithErrorControl: (
        Entity: typeof BaseSmartDBEntity,
        modalTitleTx: string,
        messageActionTx: string,
        txApiRoute: string,
        fetchParams: () => Promise<{
            lucid: LucidEvolution;
            emulatorDB: EmulatorEntity | undefined;
            walletTxParams: WalletTxParams;
            txParams: any;
        }>,
        txApiCall: (Entity: typeof BaseSmartDBEntity, txApiRoute: string, walletTxParams: WalletTxParams, txParams: any) => Promise<any>,
        handleBtnTxNoErrorControl: (
            Entity: typeof BaseSmartDBEntity,
            modalTitleTx: string,
            messageActionTx: string,
            lucid: LucidEvolution,
            emulatorDB: EmulatorEntity | undefined,
            apiTxCall: () => Promise<any>,
            setProcessingTxMessage: (processingTxMessage: string) => void,
            setProcessingTxHash: (processingTxHash: string) => void,
            walletStore: IUseWalletStore
        ) => Promise<void>,
        onTx?: (() => Promise<void>) | undefined
    ) => Promise<void>,
    campaign: CampaignEX,
    campaignStatus: CampaignStatusEntity[],
    data?: Record<string, any>,
    onFinish?: (campaign: CampaignEX, data?: Record<string, any>) => Promise<void>
) {
    try {
        //--------------------------------------
        // Estado Inicial DB: Contract Started
        // Estado Final DB: Countdown/Fundraising/Finishing (según fecha)
        // Estado Inicial Datum: CsCreated
        // Estado Final Datum: CsInitialized
        //--------------------------------------
        console.log(`serviceLaunchCampaign`);
        //--------------------------------------
        if (appStore.isProcessingTx === true) {
            openModal(ModalsEnums.PROCESSING_TX);
            return;
        }
        if (appStore.isProcessingTask === true) {
            openModal(ModalsEnums.PROCESSING_TASK);
            return;
        }
        //--------------------------------------
        if (protocol === undefined) {
            console.error('Protocol is undefined');
            return;
        }
        if (campaign.campaign.campaignToken_PriceADA === undefined || campaign.campaign.campaignToken_PriceADA === 0n) {
            alert('Must set Token Price');
            return;
        }
        if (campaign.campaign.mint_CampaignToken === false && (isNullOrBlank(campaign.campaign.campaignToken_CS) || isNullOrBlank(campaign.campaign.campaignToken_TN))) {
            alert('When providing your own Token, you must set Token Policy and Token Name');
            return;
        }
        //--------------------------------------
        let campaign_id = campaign.campaign._DB_id;
        //--------------------------------------
        const fetchParams = async () => {
            //--------------------------------------
            const { lucid, emulatorDB, walletTxParams } = await LucidToolsFrontEnd.prepareLucidFrontEndForTx(walletStore);
            //--------------------------------------
            const txParams: CampaignLaunchTxParams = {
                protocol_id: protocol!._DB_id!,
                campaign_id,
            };
            return {
                lucid,
                emulatorDB,
                walletTxParams,
                txParams,
            };
        };
        //--------------------------------------
        openModal(ModalsEnums.PROCESSING_TX);
        //--------------------------------------
        const txApiCall = CampaignApi.callGenericTxApi.bind(CampaignApi);
        const handleBtnTx = BaseSmartDBFrontEndBtnHandlers.handleBtnDoTransaction_V2_NoErrorControl.bind(BaseSmartDBFrontEndBtnHandlers);
        //--------------------------------------
        const onTx = async () => {};
        //--------------------------------------
        await handleBtnDoTransaction_WithErrorControl(CampaignEntity, TxEnums.CAMPAIGN_LAUNCH, 'Launch Campaign...', 'launch-tx', fetchParams, txApiCall, handleBtnTx, onTx);
        //--------------------------------------
        if (onFinish !== undefined) {
            await onFinish(campaign, data);
        }
        //--------------------------------------
    } catch (e) {
        console.error(e);
        pushWarningNotification(`${PROYECT_NAME}`, `Error updating: ${e}`);
    }
}

export async function serviceInvest(
    appStore: IUseAppStore,
    walletStore: IUseWalletStore,
    openModal: (
        modal: ModalsEnums,
        data?: Record<string, any>,
        handles?: Partial<Record<HandlesEnums, (data?: Record<string, any>) => Promise<string | boolean | undefined | void>>>,
        component?: ReactNode
    ) => void,
    protocol: ProtocolEntity | undefined,
    handleBtnDoTransaction_WithErrorControl: (
        Entity: typeof BaseSmartDBEntity,
        modalTitleTx: string,
        messageActionTx: string,
        txApiRoute: string,
        fetchParams: () => Promise<{
            lucid: LucidEvolution;
            emulatorDB: EmulatorEntity | undefined;
            walletTxParams: WalletTxParams;
            txParams: any;
        }>,
        txApiCall: (Entity: typeof BaseSmartDBEntity, txApiRoute: string, walletTxParams: WalletTxParams, txParams: any) => Promise<any>,
        handleBtnTxNoErrorControl: (
            Entity: typeof BaseSmartDBEntity,
            modalTitleTx: string,
            messageActionTx: string,
            lucid: LucidEvolution,
            emulatorDB: EmulatorEntity | undefined,
            apiTxCall: () => Promise<any>,
            setProcessingTxMessage: (processingTxMessage: string) => void,
            setProcessingTxHash: (processingTxHash: string) => void,
            walletStore: IUseWalletStore
        ) => Promise<void>,
        onTx?: (() => Promise<void>) | undefined
    ) => Promise<void>,
    campaign: CampaignEX,
    campaignStatus: CampaignStatusEntity[],
    data?: Record<string, any>,
    onFinish?: (campaign: CampaignEX, data?: Record<string, any>) => Promise<void>
) {
    try {
        //--------------------------------------
        console.log(`serviceInvest`);
        //--------------------------------------
        if (appStore.isProcessingTx === true) {
            openModal(ModalsEnums.PROCESSING_TX);
            return;
        }
        if (appStore.isProcessingTask === true) {
            openModal(ModalsEnums.PROCESSING_TASK);
            return;
        }
        //--------------------------------------
        if (protocol === undefined) {
            console.error('Protocol is undefined');
            return;
        }
        //--------------------------------------
        let campaign_id = campaign.campaign._DB_id;
        //--------------------------------------
        const campaignFunds: CampaignFundsEntity[] | undefined = await CampaignFundsApi.getByParamsApi_(
            { cfdCampaignPolicy_CS: campaign.campaign.getNET_id_CS() },
            {
                loadRelations: { smartUTxO_id: true },
            }
        );
        if (campaignFunds.length === 0) {
            throw new Error(`Campaign Funds not found`);
        }
        //--------------------------------------
        const fetchParams = async () => {
            //--------------------------------------
            const { lucid, emulatorDB, walletTxParams } = await LucidToolsFrontEnd.prepareLucidFrontEndForTx(walletStore);
            //--------------------------------------
            const txParams: CampaignFundsInvestTxParams = {
                protocol_id: protocol!._DB_id!,
                campaign_id,
                campaign_funds_id: campaignFunds[0]._DB_id,
                amount: data!.amount!,
            };
            return {
                lucid,
                emulatorDB,
                walletTxParams,
                txParams,
            };
        };
        //--------------------------------------
        openModal(ModalsEnums.PROCESSING_TX);
        //--------------------------------------
        const txApiCall = CampaignApi.callGenericTxApi.bind(CampaignApi);
        const handleBtnTx = BaseSmartDBFrontEndBtnHandlers.handleBtnDoTransaction_V2_NoErrorControl.bind(BaseSmartDBFrontEndBtnHandlers);
        //--------------------------------------
        const onTx = async () => {
            appStore.setProcessingTxMessage(`Updating status......`);
            const investors = campaign.campaign.investors + 1;
            await CampaignApi.updateWithParamsApi_(campaign.campaign._DB_id, { investors });
        };
        //--------------------------------------
        await handleBtnDoTransaction_WithErrorControl(
            CampaignEntity,
            TxEnums.CAMPAIGN_FUNDS_INVEST,
            'Invest in Campaign...',
            'campaign-invest-tx',
            fetchParams,
            txApiCall,
            handleBtnTx,
            onTx
        );
        //--------------------------------------
        if (onFinish !== undefined) {
            await onFinish(campaign, data);
        }
        //--------------------------------------
    } catch (e) {
        console.error(e);
        pushWarningNotification(`${PROYECT_NAME}`, `Error investing: ${e}`);
    }
}

export async function serviceValidateFundraisingStatus(
    appStore: IUseAppStore,
    walletStore: IUseWalletStore,
    openModal: (
        modal: ModalsEnums,
        data?: Record<string, any>,
        handles?: Partial<Record<HandlesEnums, (data?: Record<string, any>) => Promise<string | boolean | undefined | void>>>,
        component?: ReactNode
    ) => void,
    protocol: ProtocolEntity | undefined,
    handleBtnDoTransaction_WithErrorControl: (
        Entity: typeof BaseSmartDBEntity,
        modalTitleTx: string,
        messageActionTx: string,
        txApiRoute: string,
        fetchParams: () => Promise<{
            lucid: LucidEvolution;
            emulatorDB: EmulatorEntity | undefined;
            walletTxParams: WalletTxParams;
            txParams: any;
        }>,
        txApiCall: (Entity: typeof BaseSmartDBEntity, txApiRoute: string, walletTxParams: WalletTxParams, txParams: any) => Promise<any>,
        handleBtnTxNoErrorControl: (
            Entity: typeof BaseSmartDBEntity,
            modalTitleTx: string,
            messageActionTx: string,
            lucid: LucidEvolution,
            emulatorDB: EmulatorEntity | undefined,
            apiTxCall: () => Promise<any>,
            setProcessingTxMessage: (processingTxMessage: string) => void,
            setProcessingTxHash: (processingTxHash: string) => void,
            walletStore: IUseWalletStore
        ) => Promise<void>,
        onTx?: (() => Promise<void>) | undefined
    ) => Promise<void>,
    campaign: CampaignEX,
    campaignStatus: CampaignStatusEntity[],
    data?: Record<string, any>,
    onFinish?: (campaign: CampaignEX, data?: Record<string, any>) => Promise<void>
) {
    try {
        //--------------------------------------
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
        //--------------------------------------
        console.log(`serviceValidateFundraisingStatus`);
        //--------------------------------------
        if (appStore.isProcessingTx === true) {
            openModal(ModalsEnums.PROCESSING_TX);
            return;
        }
        if (appStore.isProcessingTask === true) {
            openModal(ModalsEnums.PROCESSING_TASK);
            return;
        }
        //--------------------------------------
        if (protocol === undefined) {
            console.error('Protocol is undefined');
            return;
        }
        //--------------------------------------
        let campaign_id = campaign.campaign._DB_id;
        //--------------------------------------
        const campaignFunds: CampaignFundsEntity[] | undefined = await CampaignFundsApi.getByParamsApi_(
            { cfdCampaignPolicy_CS: campaign.campaign.getNET_id_CS() },
            {
                loadRelations: { smartUTxO_id: true },
            }
        );
        if (campaignFunds.length === 0) {
            throw new Error(`Campaign Funds not found`);
        }
        //--------------------------------------
        const sumAvalaibleADA = campaignFunds.reduce((acc, campaignFund) => {
            return acc + BigInt(campaignFund.cfdSubtotal_Avalaible_ADA);
        }, BigInt(0));
        //--------------------------------------
        console.log(`sumAvalaibleADA: ${sumAvalaibleADA}`);
        console.log(`campaign.campaign.cdRequestedMinADA: ${campaign.campaign.cdRequestedMinADA}`);
        //--------------------------------------
        if (sumAvalaibleADA > campaign.campaign.cdRequestedMinADA) {
            //--------------------------------------
            const fetchParams = async () => {
                //--------------------------------------
                const { lucid, emulatorDB, walletTxParams } = await LucidToolsFrontEnd.prepareLucidFrontEndForTx(walletStore);
                //--------------------------------------
                const txParams: CampaignCampaingReachedTxParams = {
                    protocol_id: protocol!._DB_id!,
                    campaign_id,
                };
                return {
                    lucid,
                    emulatorDB,
                    walletTxParams,
                    txParams,
                };
            };
            //--------------------------------------
            openModal(ModalsEnums.PROCESSING_TX);
            //--------------------------------------
            const txApiCall = CampaignApi.callGenericTxApi.bind(CampaignApi);
            const handleBtnTx = BaseSmartDBFrontEndBtnHandlers.handleBtnDoTransaction_V2_NoErrorControl.bind(BaseSmartDBFrontEndBtnHandlers);
            //--------------------------------------
            const onTx = async () => {
                appStore.setProcessingTxMessage(`Updating status......`);
                // const status = campaignStatus.find((status) => status.code_id === CampaignStatus_Code_Id_Enums.ACTIVE);
                // if (!status) {
                //     throw new Error(`Status ACTIVE code-id: ${CampaignStatus_Code_Id_Enums.ACTIVE} not found`);
                // }
                // const campaign_status_id = status._DB_id;
                const campaign_actived_date = new Date();
                await CampaignApi.updateWithParamsApi_(campaign.campaign._DB_id, { campaign_actived_date });
            };
            //--------------------------------------
            await handleBtnDoTransaction_WithErrorControl(
                CampaignEntity,
                TxEnums.CAMPAIGN_REACHED,
                'Validate Fundraising Status Reached...',
                'campaign-reached-tx',
                fetchParams,
                txApiCall,
                handleBtnTx,
                onTx
            );
            //--------------------------------------
            if (onFinish !== undefined) {
                await onFinish(campaign, data);
            }
            //--------------------------------------
        } else {
            //--------------------------------------
            const fetchParams = async () => {
                //--------------------------------------
                const { lucid, emulatorDB, walletTxParams } = await LucidToolsFrontEnd.prepareLucidFrontEndForTx(walletStore);
                //--------------------------------------
                const txParams: CampaignCampaingNotReachedTxParams = {
                    protocol_id: protocol!._DB_id!,
                    campaign_id,
                };
                return {
                    lucid,
                    emulatorDB,
                    walletTxParams,
                    txParams,
                };
            };
            //--------------------------------------
            openModal(ModalsEnums.PROCESSING_TX);
            //--------------------------------------
            const txApiCall = CampaignApi.callGenericTxApi.bind(CampaignApi);
            const handleBtnTx = BaseSmartDBFrontEndBtnHandlers.handleBtnDoTransaction_V2_NoErrorControl.bind(BaseSmartDBFrontEndBtnHandlers);
            //--------------------------------------
            const onTx = async () => {
                // appStore.setProcessingTxMessage(`Updating status......`);
                // const status = campaignStatus.find((status) => status.code_id === CampaignStatus_Code_Id_Enums.UNREACHED);
                // if (!status) {
                //     throw new Error(`Status UNREACHED code-id: ${CampaignStatus_Code_Id_Enums.UNREACHED} not found`);
                // }
                // const campaign_status_id = status._DB_id;
                // await CampaignApi.updateWithParamsApi_(campaign.campaign._DB_id, { campaign_status_id });
            };
            //--------------------------------------
            await handleBtnDoTransaction_WithErrorControl(
                CampaignEntity,
                TxEnums.CAMPAIGN_NOT_REACHED,
                'Validate Fundraising Status Not Reached...',
                'campaign-not-reached-tx',
                fetchParams,
                txApiCall,
                handleBtnTx,
                onTx
            );
            //--------------------------------------
            if (onFinish !== undefined) {
                await onFinish(campaign, data);
            }
            //--------------------------------------
        }
    } catch (e) {
        console.error(e);
        pushWarningNotification(`${PROYECT_NAME}`, `Error Set Fund Raising Status: ${e}`);
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

        pushSucessNotification(`${PROYECT_NAME}`, 'Updated successfully', false);

        if (onFinish !== undefined) {
            await onFinish(campaign, data);
        }
    } catch (e) {
        console.error(e);
        pushWarningNotification(`${PROYECT_NAME}`, `Error updating: ${e}`);
    }
}
