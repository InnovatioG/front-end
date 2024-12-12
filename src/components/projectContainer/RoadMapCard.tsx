import React, { useEffect, useState } from 'react';
import styles from "./RoadMapCard.module.scss";
import { getOrdinalString } from '@/utils/formats';
import type { MilestoneF } from '@/HardCode/databaseType';
import MilestoneTime from '@/components/campaign/creator/projectEditionContainer/MilestoneTimeEdit';
import MilestonePercentage from '../campaign/creator/projectEditionContainer/MilestonePercentage';
import { stylesByStatus, imageByStatus } from '@/utils/constants';
import MilestoneMessage from './MilestoneMessage';



interface RoadMapCardProps {
    milestone: MilestoneF;
    index: number;
    goal: number;
}

const RoadMapCard: React.FC<RoadMapCardProps> = ({ milestone, index, goal }) => {
    const ordinalString = getOrdinalString(index + 1);








    return (
        <article className={styles.layout}>
            <div className={styles.descriptionContainer}>
                <div className={styles.titleContainer}>
                    <h4 className={`${styles.milestoneTitle} ${stylesByStatus(milestone.status, styles)}`}>
                        {ordinalString} Milestone
                    </h4>
                    <img src={imageByStatus(milestone.status)} alt="tic" />
                </div>
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
                />
            </div>
            <MilestoneMessage milestone={milestone} />
        </article>
    );
};

export default RoadMapCard;