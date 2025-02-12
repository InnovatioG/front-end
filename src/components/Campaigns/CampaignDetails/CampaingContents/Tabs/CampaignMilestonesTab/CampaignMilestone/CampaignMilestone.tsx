import { getMilestoneStatus_Code_Id_By_Db_Id, ICampaignDetails } from '@/hooks/useCampaingDetails';
import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import { MilestoneEX } from '@/types/types';
import { ImageByMilestoneStatus_Code_Id, StylesByMilestoneStatus_Code_Id } from '@/utils/constants/stylesAndButtonsByStatusCodeId';
import { getOrdinalString } from '@/utils/formats';
import Image from 'next/image';
import React from 'react';
import styles from './CampaignMilestone.module.scss';
import MilestoneMessage from './MilestoneMessage/MilestoneMessage';
import MilestonePercentage from './MilestonePercentage/MilestonePercentage';
import MilestoneTime from './MilestoneTime/MilestoneTime';

interface CampaignMilestoneProps {
    milestone: MilestoneEX;
    index: number;
}

const CampaignMilestone: React.FC<CampaignMilestoneProps & ICampaignIdStoreSafe & ICampaignDetails> = (props) => {
    const { milestone, index } = props;
    const milestoneStatus_Code_Id = getMilestoneStatus_Code_Id_By_Db_Id(milestone.milestone.milestone_status_id);
    const ordinalString = getOrdinalString(index + 1);
    // const { openModal } = useModal();
    const { description } = milestone.milestone;

    const milestoneIcon = ImageByMilestoneStatus_Code_Id(milestoneStatus_Code_Id);
    const milestoneStyle = StylesByMilestoneStatus_Code_Id(milestoneStatus_Code_Id);

    return (
        <article className={styles.main}>
            <div className={styles.layout}>
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
                    <MilestoneTime {...props} />
                    <MilestonePercentage maxAvailablePercentage={100} onPercentageChange={() => true} {...props} />
                </div>
            </div>

            <section className={styles.milestoneMessage}>
                <MilestoneMessage icon={milestoneIcon} {...props} />
            </section>
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
