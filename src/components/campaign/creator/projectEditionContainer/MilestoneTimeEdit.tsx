import React, { useState } from 'react';
import styles from "./MilestoneTimeEdit.module.scss"
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
import type { MilestoneF } from "@/HardCode/databaseType";
import { formatDateFromString } from '@/utils/formats';

interface MilestoneTimeEditProps {
    milestone: MilestoneF;
}

const numberToWords: { [key: number]: string } = {
    2: '2',
    3: '3',
    4: '4',
    5: '5'
};

const MilestoneTimeEdit: React.FC<MilestoneTimeEditProps> = ({ milestone }) => {
    const { project, setProject, setMilestone, editionMode } = useProjectDetailStore();
    const weekOptions = [2, 3, 4, 5];


    const handleWeekSelect = (weeks: number) => {
        const updatedMilestone = {
            ...milestone,
            cmEstimatedDeliveryDate: `${numberToWords[weeks]} weeks`
        };
        const updatedMilestones = project.milestones.map(m =>
            m.id === milestone.id ? updatedMilestone : m
        );
        setProject({
            ...project,
            milestones: updatedMilestones
        });
        setMilestone(updatedMilestone);
    };


    const handleResetWeek = () => {
        const updatedMilestone = {
            ...milestone,
            cmEstimatedDeliveryDate: ""
        };
        const updatedMilestones = project.milestones.map(m =>
            m.id === milestone.id ? updatedMilestone : m
        );
        setProject({
            ...project,
            milestones: updatedMilestones
        });
        setMilestone(updatedMilestone);
    }

    return (
        <div className={styles.general}>
            {milestone.cmEstimatedDeliveryDate === "" && editionMode ? (
                <div className={styles.timeOptionsContainer}>
                    {weekOptions.map(weeks => (
                        <button
                            key={weeks}
                            className={styles.timeButton}
                            onClick={() => handleWeekSelect(weeks)}
                        >
                            {weeks} weeks
                        </button>
                    ))}
                </div>
            ) : (
                <div className={styles.finalDelivaryDate}>
                    {
                        editionMode &&
                        <button onClick={handleResetWeek} className={styles.backButton}>
                            <img src="/img/icons/arrow-back.svg" alt="arrow-back" />
                        </button>
                    }
                    <span>{formatDateFromString(milestone.cmEstimatedDeliveryDate)}</span>
                </div>
            )}
        </div>
    );
}

export default MilestoneTimeEdit;


/* 
const MilestoneTimeEdit = () => {
    const weekOptions = [2, 3, 4, 5];

    return (
        <div className={styles.timeOptionsContainer}>
            {weekOptions.map(weeks => (
                <button
                    key={weeks}
                    className={styles.timeButton}
                >
                    {weeks} weeks
                </button>
            ))}
        </div>
    );
}

export default MilestoneTimeEdit; */