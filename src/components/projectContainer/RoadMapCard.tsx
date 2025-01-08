import React, { useEffect } from 'react';
import styles from './RoadMapCard.module.scss';
import { getOrdinalString } from '@/utils/formats';
import type { MilestoneF } from '@/HardCode/databaseType';
import MilestoneTime from '@/components/campaign/creator/projectEditionContainer/MilestoneTimeEdit';
import MilestonePercentage from '../campaign/creator/projectEditionContainer/MilestonePercentage';
import { stylesByStatus, imageByStatus } from '@/utils/constants/status';
import MilestoneMessage from './MilestoneMessage';
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
import GeneralButtonUI from '../buttons/UI/Button';
import { useModal } from '@/contexts/ModalContext';

interface RoadMapCardProps {
    milestone: MilestoneF;
    index: number;
    goal: number;
}

const RoadMapCard: React.FC<RoadMapCardProps> = ({ milestone, index, goal }) => {
    const ordinalString = getOrdinalString(index + 1);
    const { isAdmin } = useProjectDetailStore();

    const { openModal } = useModal();

    useEffect(() => {
        console.log(milestone);
    }, [milestone]);

    const milestone_status_id = milestone.milestone_status?.milestone_submission?.milestone_status_id || 0;

    const report_proof_of_finalization = milestone.milestone_status?.milestone_submission?.report_proof_of_finalization;

    const icon = milestone_status_id ? imageByStatus(milestone_status_id) : '';
    const milestoneStyle = stylesByStatus(milestone_status_id, styles);

    return (
        <article className={styles.main}>
            <div className={styles.layout}>
                <div className={styles.descriptionContainer}>
                    <div className={styles.titleContainer}>
                        <h4 className={`${styles.milestoneTitle} ${milestoneStyle}`}>{ordinalString} Milestone</h4>
                        {icon && <img src={icon} alt="Milestone status icon" />}
                    </div>
                    {milestone.milestone_status?.description && <div dangerouslySetInnerHTML={{ __html: milestone.milestone_status.description }}></div>}
                </div>
                <div className={styles.timesCard}>
                    <label>Time</label>
                    <MilestoneTime milestone={milestone} />
                    <MilestonePercentage milestone={milestone} goal={goal} maxAvailablePercentage={100} onPercentageChange={() => true} />
                </div>
            </div>
            {isAdmin && (
                <section className={styles.milestoneMessage}>
                    <MilestoneMessage milestone={milestone} icon={icon} />
                </section>
            )}
            {report_proof_of_finalization && (
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
            )}
        </article>
    );
};

export default RoadMapCard;
