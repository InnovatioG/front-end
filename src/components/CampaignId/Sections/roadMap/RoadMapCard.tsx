import MilestonePercentage from '@/components/CampaignId/Elements/MilestonePercentage/MilestonePercentage';
import MilestoneTime from '@/components/CampaignId/Elements/MilestoneTimeEdit/MilestoneTimeEdit';
import GeneralButtonUI from '@/components/UI/Buttons/UI/Button';
import { useModal } from '@/contexts/ModalContext';
import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';
import { imageByStatus, imageByStatusMilestone, stylesByStatus } from '@/utils/constants/status';
import { getOrdinalString } from '@/utils/formats';
import React, { useEffect } from 'react';
import MilestoneMessage from "@/components/CampaignId/Sections/milestoneMessage/MilestoneMessage"
import styles from './RoadMapCard.module.scss';
import type { Milestone } from '@/types/types';
import { useGeneralStore } from '@/store/generalConstants/useGeneralConstants';

interface RoadMapCardProps {
    milestone: Milestone;
    index: number;
    goal: number;
}

const RoadMapCard: React.FC<RoadMapCardProps> = ({ milestone, index, goal }) => {
    const { milestoneStatus } = useGeneralStore();
    const ordinalString = getOrdinalString(index + 1);
    const { isAdmin } = useCampaignIdStore();
    const { openModal } = useModal();
    const { milestone_status_id, description } = milestone;

    console.log(milestone)

    const getInternalId = (milestoneStatusId: string | undefined): number | undefined => {
        const status = milestoneStatus.find((status) => status.id === Number(milestoneStatusId));
        return status?.id_internal;
    };

    const internalId = getInternalId(milestone_status_id);
    const icon = internalId !== undefined ? imageByStatusMilestone(internalId) : undefined;
    console.log(icon);
    const milestoneStyle = internalId !== undefined ? stylesByStatus(internalId, styles) : '';



    return (
        <article className={styles.main}>
            <div className={styles.layout}>
                <div className={styles.descriptionContainer}>
                    <div className={styles.titleContainer}>
                        <h4 className={`${styles.milestoneTitle} ${milestoneStyle}`}>{ordinalString} Milestone</h4>
                        {icon && <img src={icon} alt="Milestone status icon" />}
                    </div>
                    {description && <div dangerouslySetInnerHTML={{ __html: description }}></div>}
                </div>
                <div className={styles.timesCard}>
                    <label>Time</label>
                    <MilestoneTime milestone={milestone} />
                    <MilestonePercentage milestone={milestone} goal={goal} maxAvailablePercentage={100} onPercentageChange={() => true} />
                </div>
            </div>
            {/*             {isAdmin && (
 */}                <section className={styles.milestoneMessage}>
                <MilestoneMessage milestone={milestone} icon={icon} />
            </section>
            {/*    {report_proof_of_finalization && (
                <section className={styles.buttonView}>
                    <GeneralButtonUI
                        classNameStyle="fillb"
                        onClick={() => {
                            openModal('viewReportMilestone', { campaign_id: 0, campaign: undefined, submission: report_proof_of_finalization });
                        }}
                    >
                        View Reprt Submitted
                    </GeneralButtonUI>
                </section>
            )} */}
        </article>
    );
};

export default RoadMapCard;
