import AddMore from '@/components/General/Buttons/AddMore/AddMore';
import { ICampaignDetails } from '@/hooks/useCampaingDetails';
import { MilestoneEntity } from '@/lib/SmartDB/Entities';
import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import { MilestoneEX } from '@/types/types';
import { PageViewEnums } from '@/utils/constants/routes';
import React, { useEffect, useMemo, useState } from 'react';
import { DropResult } from 'react-beautiful-dnd';
import EmptyState from '../EmpyState/EmptyState';
import CampaignMilestone from './CampaignMilestone/CampaignMilestone';
import styles from './CampaignMilestonesTab.module.scss';
import { MilestoneStatus_Code_Id_Enums } from '@/utils/constants/status/status';
import { getMilestoneStatus_Db_Id_By_Code_Id } from '@/utils/campaignHelpers';

const CampaignMilestonesTab: React.FC<ICampaignIdStoreSafe & ICampaignDetails> = (props) => {
    const { campaign, setCampaign, setCampaignEX, setIsValidEdit } = props;
    const milestones = useMemo(() => [...(campaign.milestones ?? [])].sort((a, b) => a.milestone.order - b.milestone.order), [campaign]);
    const [isOpenAddMore, setIsOpenAddMore] = useState(false);

    const conditionsToPrompForEdit = milestones && milestones.length === 0;

    const isEditing = props.pageView === PageViewEnums.MANAGE && props.isEditMode === true;

    useEffect(() => {
        let validPercentage = false;
        let validDays = false;
        if (milestones.length > 0) {
            validPercentage =
                milestones.reduce((sum, milestone) => sum + milestone.milestone.percentage, 0) === 100 &&
                milestones.every((milestone) => milestone.milestone.percentage > 0 && milestone.milestone.percentage < 100);
            validDays = milestones.every((milestone) => milestone.milestone.estimate_delivery_days > 0);
        }
        setIsValidEdit(validPercentage && validDays);
    }, [milestones]);

    const handleAddMilestone = (milestone: MilestoneEntity) => {
        const newMilestone = new MilestoneEntity(milestone);
        newMilestone.campaign_id = campaign.campaign._DB_id;
        newMilestone.milestone_status_id = getMilestoneStatus_Db_Id_By_Code_Id(MilestoneStatus_Code_Id_Enums.NOT_STARTED);
        newMilestone.percentage = 100 - milestones.reduce((sum, milestone) => sum + milestone.milestone.percentage, 0);
        newMilestone.estimate_delivery_days = 0;
        const newMilestoEX = { milestone: newMilestone } as MilestoneEX;
        let order = 1;
        const reorderedMilestones = [...milestones, newMilestoEX].map((milestone) => {
            milestone.milestone.order = order++;
            return milestone;
        });
        setCampaignEX({
            ...campaign,
            milestones: reorderedMilestones,
        });
    };

    const handleUpdateMilestone = (updatedMilestone: MilestoneEntity) => {
        const prevMilestoneEX = milestones.find((m) => m.milestone.order === updatedMilestone.order);
        if (!prevMilestoneEX) return;
        const updatedMilestoneEX = { ...prevMilestoneEX, milestone: updatedMilestone };
        setCampaignEX({
            ...campaign,
            milestones: [...milestones.filter((m) => m.milestone.order !== updatedMilestone.order), updatedMilestoneEX],
        });
    };

    const handleRemoveMilestone = (removeMilestone: MilestoneEntity) => {
        const confirm = window.confirm('Are you sure you want to delete this milestone?');
        if (!confirm) return;
        const prevMilestoneEX = milestones.find((m) => m.milestone.order === removeMilestone.order);
        if (!prevMilestoneEX) return;
        const removeMilestoneEX = { ...prevMilestoneEX, milestone: removeMilestone };
        const deletedItems = removeMilestone._DB_id === undefined ? [...(campaign.milestones_deleted || [])] : [...(campaign.milestones_deleted || []), removeMilestoneEX];
        const newMilestones = milestones.filter((c) => c.milestone.order !== removeMilestone.order);
        let order = 1;
        const reorderedMilestones = newMilestones.map((milestone) => {
            milestone.milestone.order = order++;
            return milestone;
        });
        setCampaignEX({
            ...campaign,
            milestones: reorderedMilestones,
            milestones_deleted: deletedItems,
        });
    };

    const handleUpdateOrder = (result: DropResult) => {
        if (!result.destination) return;
        const updatedMilestones = Array.from(milestones);
        const [movedItem] = updatedMilestones.splice(result.source.index, 1);
        updatedMilestones.splice(result.destination.index, 0, movedItem);
        let order = 1;
        const reorderedMilestones = updatedMilestones.map((milestone) => {
            milestone.milestone.order = order++;
            return milestone;
        });
        setCampaignEX({
            ...campaign,
            milestones: reorderedMilestones,
        });
    };

    if (conditionsToPrompForEdit && props.pageView === PageViewEnums.MANAGE && props.isEditMode === false) {
        return <EmptyState {...props} />;
    }

    if (isEditing) {
        return (
            <article>
                <div className={styles.milestoneContainer}>
                    {milestones &&
                        milestones.map((milestone, index) => (
                            <div key={milestone.milestone.order}>
                                <CampaignMilestone milestone={milestone} handleUpdateMilestone={handleUpdateMilestone} handleRemoveMilestone={handleRemoveMilestone} {...props} />
                            </div>
                        ))}
                </div>
                {milestones && milestones.length <= 5 && (
                    <div className={styles.buttonGeneral}>
                        <AddMore
                            isOpen={isOpenAddMore}
                            handleAddMore={() => {
                                handleAddMilestone(new MilestoneEntity());
                            }}
                        />
                    </div>
                )}
            </article>
        );
    }

    return (
        <article>
            <div id="roadmap">
                {milestones &&
                    milestones.map((milestone) => (
                        <div key={milestone.milestone.order}>
                            <CampaignMilestone {...props} milestone={milestone} handleUpdateMilestone={handleUpdateMilestone} handleRemoveMilestone={handleRemoveMilestone} />
                        </div>
                    ))}
            </div>
        </article>
    );
};

export default CampaignMilestonesTab;
