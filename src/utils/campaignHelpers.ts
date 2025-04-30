import { CampaignEntity, MilestoneEntity, CampaignFaqsEntity, CampaignMemberEntity, CampaignContentEntity, MilestoneSubmissionEntity, CampaignSubmissionEntity } from '@/lib/SmartDB/Entities';
import { MilestoneApi, CampaignFaqsApi, CampaignMemberApi, CampaignContentApi, MilestoneSubmissionApi } from '@/lib/SmartDB/FrontEnd';
import { useGeneralStore } from '@/store/generalStore/useGeneralStore';
import { CampaignEX, MilestoneEX } from '@/types/types';
import { MilestoneStatus_Code_Id_Enums } from '@/utils/constants/status/status';

export const getCampaignEX = async (campaign: CampaignEntity): Promise<CampaignEX> => {
    const milestonesEntities: MilestoneEntity[] = await MilestoneApi.getByParamsApi_({ campaign_id: campaign._DB_id }, { sort: { order: 1 } });
    const campaignFaqsEntities: CampaignFaqsEntity[] = await CampaignFaqsApi.getByParamsApi_({ campaign_id: campaign._DB_id }, { sort: { order: 1 } });
    const campaignMemberEntities: CampaignMemberEntity[] = await CampaignMemberApi.getByParamsApi_({ campaign_id: campaign._DB_id }, { sort: { order: 1 } });
    const campaignnContentEntities: CampaignContentEntity[] = await CampaignContentApi.getByParamsApi_({ campaign_id: campaign._DB_id }, { sort: { order: 1 } });

    const milestonesEX = await Promise.all(milestonesEntities.map(getMilestonesEX));

    return {
        campaign: campaign,
        milestones: milestonesEX,
        contents: campaignnContentEntities,
        members: campaignMemberEntities,
        faqs: campaignFaqsEntities,
    };
};

export const getMilestonesEX = async (milestone: MilestoneEntity): Promise<MilestoneEX> => {
    const milestone_submissions: MilestoneSubmissionEntity[] = await MilestoneSubmissionApi.getByParamsApi_({ milestone_id: milestone._DB_id }, { sort: { updatedAt: -1 } });

    return {
        milestone: milestone,
        milestone_submissions: milestone_submissions,
    };
};
// Deep copies a `CampaignEX` object, ensuring all nested entities are properly instantiated.


export const cloneCampaignEX = (campaign: CampaignEX | undefined): CampaignEX | undefined => {
    if (!campaign) return undefined;

    return {
        campaign: new CampaignEntity({ ...campaign.campaign }), // Ensure new instance
        campaign_submissions: campaign.campaign_submissions
            ? campaign.campaign_submissions.map((s) => new CampaignSubmissionEntity({ ...s })) // Ensure deep copy
            : undefined,
        campaign_submissions_deleted: campaign.campaign_submissions_deleted
            ? campaign.campaign_submissions_deleted.map((s) => new CampaignSubmissionEntity({ ...s })) // Ensure deep copy
            : undefined,
        milestones: campaign.milestones
            ? campaign.milestones.map((m) => cloneMilestoneEX(m)) // Clone each milestone
            : undefined,
        milestones_deleted: campaign.milestones_deleted
            ? campaign.milestones_deleted.map((m) => cloneMilestoneEX(m)) // Clone each milestone
            : undefined,
        contents: campaign.contents
            ? campaign.contents.map((c) => new CampaignContentEntity({ ...c })) // Ensure deep copy
            : undefined,
        contents_deleted: campaign.contents_deleted
            ? campaign.contents_deleted.map((c) => new CampaignContentEntity({ ...c })) // Ensure deep copy
            : undefined,
        members: campaign.members
            ? campaign.members.map((m) => new CampaignMemberEntity({ ...m })) // Ensure deep copy
            : undefined,
        members_deleted: campaign.members_deleted
            ? campaign.members_deleted.map((m) => new CampaignMemberEntity({ ...m })) // Ensure deep copy
            : undefined,
        faqs: campaign.faqs
            ? campaign.faqs.map((f) => new CampaignFaqsEntity({ ...f })) // Ensure deep copy
            : undefined,
        faqs_deleted: campaign.faqs_deleted
            ? campaign.faqs_deleted.map((f) => new CampaignFaqsEntity({ ...f })) // Ensure deep copy
            : undefined,
        files_to_delete: campaign.files_to_delete ? [...campaign.files_to_delete] : undefined,
    };
};
// Deep copies a `MilestoneEX` object.

export const cloneMilestoneEX = (milestone: MilestoneEX): MilestoneEX => {
    return {
        milestone: new MilestoneEntity({ ...milestone.milestone }), // Ensure new instance
        milestone_submissions: milestone.milestone_submissions
            ? milestone.milestone_submissions.map((s) => new MilestoneSubmissionEntity({ ...s })) // Ensure deep copy
            : undefined,
        milestone_submissions_deleted: milestone.milestone_submissions_deleted
            ? milestone.milestone_submissions_deleted.map((s) => new MilestoneSubmissionEntity({ ...s })) // Ensure deep copy
            : undefined,
    };
};

export const getCurrentMilestoneIndex = (campaign: CampaignEX): number | undefined => {
    // console.log('getCurrentMilestoneIndex', toJson(campaign));
    if (!campaign.milestones || campaign.milestones.length === 0) {
        return undefined;
    }

    let firstNotStartedIndex = -1;
    let lastFinishedIndex = -1;
    let hasActiveMilestone = false;

    for (let i = 0; i < campaign.milestones.length; i++) {
        const milestone = campaign.milestones[i];
        const code_id = getMilestoneStatus_Code_Id_By_Db_Id(milestone.milestone.milestone_status_id);

        if (code_id === MilestoneStatus_Code_Id_Enums.NOT_STARTED) {
            if (firstNotStartedIndex === -1) {
                firstNotStartedIndex = i;
            }
        } else if (code_id === MilestoneStatus_Code_Id_Enums.FINISHED) {
            lastFinishedIndex = i;
        } else {
            // If milestone is STARTED, SUBMITTED, REJECTED, or FAILED, return it as the current active
            hasActiveMilestone = true;
            return i;
        }
    }

    // Case 1: If all milestones are FINISHED, return the last finished milestone
    if (!hasActiveMilestone && firstNotStartedIndex === -1 && lastFinishedIndex !== -1) {
        return lastFinishedIndex;
    }

    // Case 2: If all milestones are NOT_STARTED, return the first one
    if (!hasActiveMilestone && firstNotStartedIndex !== -1 && lastFinishedIndex === -1) {
        return firstNotStartedIndex;
    }

    // Case 3: If a milestone is FINISHED, find the first NOT_STARTED milestone after it
    if (lastFinishedIndex !== -1) {
        for (let i = lastFinishedIndex + 1; i < campaign.milestones.length; i++) {
            const code_id = getMilestoneStatus_Code_Id_By_Db_Id(campaign.milestones[i].milestone.milestone_status_id);
            if (code_id === MilestoneStatus_Code_Id_Enums.NOT_STARTED) {
                return i;
            }
        }
    }

    // Case 4: If no active milestone is found, return the first NOT_STARTED one as fallback
    if (firstNotStartedIndex !== -1) {
        return firstNotStartedIndex;
    }

    throw new Error('No current milestone found');
};

export const getRemainingPercentage = (currentmilestone_id: number, milestones: MilestoneEX[]): number => {
    const totalUsed = milestones
        .filter((milestone) => Number(milestone.milestone._DB_id) !== currentmilestone_id)
        .reduce((sum, milestone) => sum + milestone.milestone.percentage, 0);
    return 100 - totalUsed;
};

export const getCampaignCategory_Name_By_Db_Id = (id: string) => {
    const category = useGeneralStore.getState().campaignCategories.find((category) => category._DB_id === id);
    if (!category) {
        throw new Error(`Campaign category with id ${id} not found`);
    }
    return category.name;
};

export const getCampaignStatus_Code_Id_By_Db_Id = (id: string) => {
    const status = useGeneralStore.getState().campaignStatus.find((status) => status._DB_id === id);
    if (!status) {
        throw new Error(`Campaign status with id ${id} not found`);
    }
    return status.code_id;
};

export const getCampaignStatus_Db_Id_By_Code_Id = (code_id: number) => {
    const status = useGeneralStore.getState().campaignStatus.find((status) => status.code_id === code_id);
    if (!status) {
        throw new Error(`Campaign status with code_id ${code_id} not found`);
    }
    return status._DB_id;
};

export const getMilestoneStatus_Code_Id_By_Db_Id = (id: string) => {
    const milestone = useGeneralStore.getState().milestoneStatus.find((status) => status._DB_id === id);
    if (!milestone) {
        throw new Error(`Milestone status with id ${id} not found`);
    }
    return milestone.code_id;
};


export const getMilestoneStatus_Db_Id_By_Code_Id = (code_id: number) => {
    const milestone = useGeneralStore.getState().milestoneStatus.find((status) => status.code_id === code_id);
    if (!milestone) {
        throw new Error(`Milestone status with code_id ${code_id} not found`);
    }
    return milestone._DB_id;
};

export const getSubmissionStatus_Name_By_Db_Id = (id: string) => {
    const status = useGeneralStore.getState().submissionStatus.find((status) => status._DB_id === id);
        if (!status) {
            throw new Error(`Submission status with id ${id} not found`);
        }
    return status.name;
};


export const getSubmissionStatus_Code_Id_By_Db_Id = (id: string) => {
    const status = useGeneralStore.getState().submissionStatus.find((status) => status._DB_id === id);
    if (!status) {
        throw new Error(`Submission status with id ${id} not found`);
    }
    return status.code_id;
};


export const getSubmissionStatus_Db_Id_By_Code_Id = (code_id: number) => {
    const status = useGeneralStore.getState().submissionStatus.find((status) => status.code_id === code_id);
    if (!status) {
        throw new Error(`Submission status with code_id ${code_id} not found`);
    }
    return status._DB_id;
};