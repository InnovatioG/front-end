import React, { useEffect } from 'react';
import styles from './CampaignMilestone.module.scss';
import { MilestoneEX } from '@/types/types';
import TextEditor from '@/components/GeneralOK/Controls/TextEditor/TextEditor';
import { getOrdinalString } from '@/utils/formats';
import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import { ICampaignDetails } from '@/hooks/useCampaingDetails';
import { MilestoneEntity } from '@/lib/SmartDB/Entities';
import MilestonePercentage from './MilestonePercentage/MilestonePercentage';
import { getMilestoneStatus_Code_Id_By_Db_Id } from '@/utils/campaignHelpers';
import { ImageByMilestoneStatus_Code_Id, StylesByMilestoneStatus_Code_Id } from '@/utils/constants/status/styles';
import Image from 'next/image';
import MilestoneTime from './MilestoneTime/MilestoneTime';

interface CampaignMilestoneProps {
    milestone: MilestoneEX;
    handleUpdateMilestone: (updatedMilestone: MilestoneEntity) => void;
    handleRemoveMilestone: (uremoveMilestone: MilestoneEntity) => void;
}

const CampaignMilestone: React.FC<CampaignMilestoneProps & ICampaignIdStoreSafe & ICampaignDetails> = (props) => {
    const { campaign, milestone, handleUpdateMilestone, handleRemoveMilestone, isEditMode } = props;

    const ordinalString = getOrdinalString(milestone.milestone.order);
    const { description } = milestone.milestone;

    const milestoneStatus_Code_Id = getMilestoneStatus_Code_Id_By_Db_Id(milestone.milestone.milestone_status_id);
    const milestoneIcon = ImageByMilestoneStatus_Code_Id(milestoneStatus_Code_Id);
    const milestoneStyle = StylesByMilestoneStatus_Code_Id(milestoneStatus_Code_Id);

    const handleDescriptionChange = (content: string) => {
        milestone.milestone.description = content;
        handleUpdateMilestone(milestone.milestone);
    };

    const handleEstimateDeliveryDaysChange = (days: number) => {
        milestone.milestone.estimate_delivery_days = days;
        handleUpdateMilestone(milestone.milestone);
    };

    const handlePercentageChange = (percentage: number) => {
        milestone.milestone.percentage = percentage;
        handleUpdateMilestone(milestone.milestone);
    };

    if (isEditMode) {
        return (
            <section className={styles.containerMilestoneEdit}>
                <div className={styles.header}>
                    <h4 className={styles.milestoneTitle}>{ordinalString} Milestone</h4>{' '}
                    <button onClick={() => handleRemoveMilestone(milestone.milestone)} className={styles.deleteButton}>
                        <Image src="/img/icons/delete.svg" alt="deleteIcon" width={18} height={18} />
                    </button>
                </div>
                <article className={styles.milestoneCardLayout}>
                    <div className={styles.textEditorContainer}>
                        <TextEditor styleOption="quillEditorB" menuOptions={1} content={milestone.milestone.description ?? ''} onChange={handleDescriptionChange} />
                    </div>
                    <div className={styles.controller}>
                        <label htmlFor="" className={styles.timeLabel}>
                            Time
                        </label>
                        <div className={styles.controllerContainer}>
                            <MilestoneTime milestone={milestone} isEditMode={isEditMode} onChange={handleEstimateDeliveryDaysChange} />
                            <MilestonePercentage campaign={campaign} milestone={milestone} isEditMode={isEditMode} onChange={handlePercentageChange} />
                        </div>
                    </div>
                </article>
            </section>
        );
    }

    return (
        <article className={styles.main}>
            <div className={styles.containerMilestoneView}>
                <div className={styles.descriptionContainer}>
                    <div className={styles.titleContainer}>
                        <h4 className={`${styles.milestoneTitle} ${styles[milestoneStyle]}`}>{ordinalString} Milestone</h4>
                        {milestoneIcon && (
                            <div className={styles.img}>
                                <Image src={milestoneIcon} alt="Milestone status icon" width={30} height={30} />
                            </div>
                        )}
                    </div>
                    {description && <div dangerouslySetInnerHTML={{ __html: description }}></div>}
                </div>
                <div className={styles.timesCard}>
                    <label>Time</label>
                    <MilestoneTime milestone={milestone} isEditMode={isEditMode} onChange={handleEstimateDeliveryDaysChange} />
                    <MilestonePercentage campaign={campaign} milestone={milestone} isEditMode={isEditMode} onChange={handlePercentageChange} />
                </div>
            </div>

            {/* <section className={styles.milestoneMessage}>
                <MilestoneMessage icon={milestoneIcon} {...props} />
            </section> */}
            {/*    {report_proof_of_finalization && (
                    <section className={styles.buttonView}>
                        <BtnGeneral
                            classNameStyle="fillb"
                            onClick={() => {
                                openModal('viewReportMilestone', { campaign_id: 0, campaign: undefined, submission: report_proof_of_finalization });
                            }}
                        >
                            View Reprt Submitted
                        </BtnGeneral>
                    </section>
                )} */}
        </article>
    );
};

export default CampaignMilestone;
