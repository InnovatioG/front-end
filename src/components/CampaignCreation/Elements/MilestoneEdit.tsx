import TextEditor from '@/components/General/Elements/TextEditor/TextEditor';
import type { Milestone } from '@/types/types'; import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';
import { getOrdinalString } from '@/utils/formats';
import React from 'react';
import styles from './MilestoneEdit.module.scss';
import MilestonePercentage from './MilestonePercentage';
import MilestoneTimeEdit from './MilestoneTimeEdit';

interface MilestoneCardEditProps {
    milestone: Milestone;
    index: number;
    maxAvailablePercentage: number;
    onPercentageChange: (percentage: number) => boolean;
}

const MilestoneCardEdit: React.FC<MilestoneCardEditProps> = ({ milestone, index, maxAvailablePercentage, onPercentageChange }) => {
    const { setCampaign, campaign } = useCampaignIdStore();
    const ordinalString = getOrdinalString(index + 1);

    const handleDescriptionChange = (content: string) => {
        const updatedMilestones = campaign.milestones.map((m) =>
            m._Db_id === milestone._Db_id && m.milestone_status_id ? { ...m, milestone_status: { ...m.milestone_status, description: content, id: m.milestone_status.id ?? 0 } } : m
        );

        setCampaign({
            ...campaign,
            milestones: updatedMilestones,
        });
    };

    const totalGoal = campaign.requestMaxAda;

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
