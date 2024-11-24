import React from 'react';
import styles from "./RoadMapCard.module.scss";
import { getOrdinalString } from '@/utils/formats';
import type { MilestoneF } from '@/HardCode/databaseType';
import MilestoneTime from '@/components/campaign/creator/projectEditionContainer/MilestoneTimeEdit';
import MilestonePercentage from '../campaign/creator/projectEditionContainer/MilestonePercentage';

interface RoadMapCardProps {
    milestone: MilestoneF;
    index: number;
    goal: number;
}

const RoadMapCard: React.FC<RoadMapCardProps> = ({ milestone, index, goal }) => {
    const ordinalString = getOrdinalString(index + 1);

    const classNameByStatus = (status: string) => {
        switch (status) {
            case 'Not Started':
                return styles.notStarted;
            case 'Started':
                return styles.started;
            case 'Submited':
                return styles.submited;
            case 'Rejected':
                return styles.rejected;
            case 'Finished':
                return styles.finished;
            case 'Failed':
                return styles.failed;
            default:
                return styles.pending;
        }
    };

    return (
        <article className={styles.layout}>
            <div className={styles.descriptionContainer}>
                <h4 className={`${styles.milestoneTitle} ${classNameByStatus(milestone.status)}`}>
                    {ordinalString} Milestone
                </h4>
                {milestone.milestone_status && (
                    <div
                        dangerouslySetInnerHTML={{ __html: milestone.milestone_status.description }}
                        className={styles.content}
                    />
                )}
            </div>
            <div className={styles.timesCard}>
                <label htmlFor="">Time</label>
                <MilestoneTime milestone={milestone} />
                <MilestonePercentage
                    milestone={milestone}
                    goal={goal}
                    maxAvailablePercentage={100}
                    onPercentageChange={() => true}
                    isLastMilestone={false}
                />
            </div>
        </article>
    );
};

export default RoadMapCard;