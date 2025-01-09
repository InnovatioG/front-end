import TextEditor from '@/components/General/Elements/TextEditor/TextEditor';
import type { MilestoneF } from '@/HardCode/databaseType';
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
import { getOrdinalString } from '@/utils/formats';
import React from 'react';
import styles from './MilestoneEdit.module.scss';
import MilestonePercentage from './MilestonePercentage';
import MilestoneTimeEdit from './MilestoneTimeEdit';

interface MilestoneCardEditProps {
    milestone: MilestoneF;
    index: number;
    maxAvailablePercentage: number;
    onPercentageChange: (percentage: number) => boolean;
}

const MilestoneCardEdit: React.FC<MilestoneCardEditProps> = ({ milestone, index, maxAvailablePercentage, onPercentageChange }) => {
    const { project, setProject } = useProjectDetailStore();
    const ordinalString = getOrdinalString(index + 1);

    const handleDescriptionChange = (content: string) => {
        const updatedMilestones = project.milestones.map((m) =>
            m.id === milestone.id && m.milestone_status ? { ...m, milestone_status: { ...m.milestone_status, description: content, id: m.milestone_status.id ?? 0 } } : m
        );

        setProject({
            ...project,
            milestones: updatedMilestones,
        });
    };

    const totalGoal = project.goal;

    return (
        <section>
            <h4 className={styles.milestoneTitle}>{ordinalString} Milestone</h4>
            <article className={styles.milestoneCardLayout}>
                <div className={styles.textEditorContianer}>
                    <TextEditor styleOption="quillEditorB" menuOptions={1} content={milestone.milestone_status?.description ?? ''} onChange={handleDescriptionChange} />
                </div>
                <div className={styles.controller}>
                    <label htmlFor="" className={styles.timeLabel}>
                        Time
                    </label>
                    <div className={styles.controllerContainer}>
                        <MilestoneTimeEdit milestone={milestone} />
                        <MilestonePercentage milestone={milestone} goal={totalGoal} maxAvailablePercentage={maxAvailablePercentage} onPercentageChange={onPercentageChange} />
                    </div>
                </div>
            </article>
        </section>
    );
};

export default MilestoneCardEdit;
