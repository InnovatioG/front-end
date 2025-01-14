import React, { useEffect } from 'react';
import TextEditor from '@/components/General/Elements/TextEditor/TextEditor';
import type { Milestone } from '@/types/types';
import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';
import { getOrdinalString } from '@/utils/formats';
import styles from './MilestoneEdit.module.scss';
import MilestonePercentage from "@/components/CampaignCreation/Elements/MilestonePercentage/MilestonePercentage"
import MilestoneTimeEdit from '@/components/CampaignCreation/Elements/MilestoneTimeEdit/MilestoneTimeEdit';
import useMilestoneCardEdit from './useMilestoneEdit';

interface MilestoneCardEditProps {
    milestone: Milestone;
    index: number;
    maxAvailablePercentage: number;
    onPercentageChange: (percentage: number) => boolean;
}

const MilestoneCardEdit: React.FC<MilestoneCardEditProps> = ({
    milestone,
    index,
    maxAvailablePercentage,
    onPercentageChange,
}) => {

    const { ordinalString, handleDescriptionChange } = useMilestoneCardEdit(
        index,
        milestone
    );


    return (
        <section>
            <h4 className={styles.milestoneTitle}>{ordinalString} Milestone</h4>
            <article className={styles.milestoneCardLayout}>
                <div className={styles.textEditorContainer}>
                    {milestone ? (
                        <TextEditor
                            styleOption="quillEditorB"
                            menuOptions={1}
                            content={milestone.description ?? ''}
                            onChange={handleDescriptionChange}
                        />
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
                <div className={styles.controller}>
                    <label htmlFor="" className={styles.timeLabel}>
                        Time
                    </label>
                    <div className={styles.controllerContainer}>
                        <MilestoneTimeEdit milestone={milestone} />
                        <MilestonePercentage
                            milestone={milestone}
                            goal={100} // Ejemplo: Sustituye por el valor real
                            maxAvailablePercentage={maxAvailablePercentage}
                            onPercentageChange={onPercentageChange}
                        />
                    </div>
                </div>
            </article>
        </section>
    );
};

export default MilestoneCardEdit;