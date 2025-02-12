import { BtnCampaignActions } from '@/components/GeneralOK/Buttons/Buttons/BtnCampaignActions/BtnCampaignActions';
import { useModal } from '@/contexts/ModalContext';
import { ICampaignDetails, saveEntityList } from '@/hooks/useCampaingDetails';
import { CampaignApi, CampaignContentApi, CampaignFaqsApi, CampaignMemberApi, CampaignSubmissionApi, MilestoneApi, MilestoneSubmissionApi } from '@/lib/SmartDB/FrontEnd';
import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import { ButtonType } from '@/utils/constants/stylesAndButtonsByStatusCodeId';
import { useRouter } from 'next/router';
import React from 'react';
import { pushSucessNotification, pushWarningNotification } from 'smart-db';
import styles from './CampaignActions.module.scss';
import { HandleEnums } from '@/utils/constants/constants';
import { CampaignEntity, MilestoneEntity, MilestoneSubmissionEntity } from '@/lib/SmartDB/Entities';
import { MilestoneEX } from '@/types/types';

const CampaignActions: React.FC<ICampaignIdStoreSafe & ICampaignDetails> = (props: ICampaignIdStoreSafe & ICampaignDetails) => {
    const { campaign, buttonsForDetails, setCampaign, setCampaignEX } = props;
    const { openModal } = useModal();
    const router = useRouter();

    const handleSaveCampaign = async () => {
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
    
            const milestoneMap = new Map(
                (campaign.milestones || [])
                    .filter((m) => m.milestone._DB_id)
                    .map((m) => [m.milestone._DB_id!, m.milestone_submissions])
            );
            
            const savedMilestones: MilestoneEX[] = savedMilestoneEntities.map((milestoneEntity) => ({
                milestone: milestoneEntity,
                milestone_submissions: milestoneMap.get(milestoneEntity._DB_id!) || [],
            }));

            setCampaignEX({
                campaign: entity,
                faqs: savedFaqs,
                contents: savedContents,
                members: savedMembers,
                campaign_submissions: campaign.campaign_submissions, 
                milestones: savedMilestones, 
            });

            pushSucessNotification('Success', 'Updated successfully', false);
        } catch (e) {
            console.error(e);
            pushWarningNotification('Error', `Error updating: ${e}`);
        }
    };

    const handleFeatureCampaign = async () => {
        try {
            let entity = campaign.campaign;
            entity.featured = true;
            // setCampaignEX({
            //     ...campaign,
            //     campaign: new CampaignEntity(entity),
            // });
            setCampaign(entity);
            entity = await CampaignApi.updateWithParamsApi_(campaign.campaign._DB_id, entity);
            pushSucessNotification('Success', 'Updated successfully', false);
        } catch (e) {
            console.error(e);
            pushWarningNotification('Error', `Error updating: ${e}`);
        }
    };

    const handleUnFeatureCampaign = async () => {
        try {
            let entity = campaign.campaign;
            entity.featured = false;
            // setCampaignEX({
            //     ...campaign,
            //     campaign: new CampaignEntity(entity),
            // });
            setCampaign(entity);
            entity = await CampaignApi.updateWithParamsApi_(campaign.campaign._DB_id, entity);
            pushSucessNotification('Success', 'Updated successfully', false);
        } catch (e) {
            console.error(e);
            pushWarningNotification('Error', `Error updating: ${e}`);
        }
    };

    const handles = {
        [HandleEnums.saveCampaign]: handleSaveCampaign,
        [HandleEnums.featureCampaign]: handleFeatureCampaign,
        [HandleEnums.unFeatureCampaign]: handleUnFeatureCampaign,
    };

    return (
        <div className={styles.buttonContainer}>
            {buttonsForDetails.map((button: ButtonType, index: number) => (
                <BtnCampaignActions key={index} button={button} data={{ id: campaign.campaign._DB_id }} navigate={router.push} openModal={openModal} handles={handles} />
            ))}
        </div>
    );
};

export default CampaignActions;
