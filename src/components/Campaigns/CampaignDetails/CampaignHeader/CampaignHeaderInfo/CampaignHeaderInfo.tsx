import ToolTipInformation from '@/components/General/ToolTipInformation/ToolTipInformation';
import { ICampaignDetails } from '@/hooks/useCampaingDetails';
import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import { formatMoneyByADAOrDollar } from '@/store/generalStore/useGeneralStore';
import { TWO_USERS } from '@/utils/constants/images';
import { CampaignStatus_Code_Id_Enums } from '@/utils/constants/status/status';
import { formatAllTime } from '@/utils/formats';
import React from 'react';
import styles from './CampaignHeaderInfo.module.scss';

const CampaignHeaderInfo: React.FC<ICampaignIdStoreSafe & ICampaignDetails> = (props: ICampaignIdStoreSafe & ICampaignDetails) => {
    const { campaign, label, labelClass, campaign_status_code_id, timeRemainingBeginAt, currentMilestoneStringOrdinal, requestedMinPercentage, progressWidth } = props;
    return (
        <section className={styles.campaignCard}>
            <div className={styles.campaignCardStatus}>
                <div className={`${styles.statusContainer} ${styles[labelClass]}`}>
                    <span className={`${styles.status} ${styles[labelClass]}`}>
                        {campaign_status_code_id === CampaignStatus_Code_Id_Enums.COUNTDOWN ? formatAllTime(timeRemainingBeginAt) : label}
                    </span>
                    <div className={styles.tooltipContainer}>
                        <ToolTipInformation content="We need to write the explination status by status " />
                    </div>
                </div>
                <div className={styles.investors}>
                    <svg width="15" height="10" className={styles.icon}>
                        <use href={TWO_USERS}></use>
                    </svg>
                    <span className={styles.span}>{campaign.campaign.investors}</span>
                </div>
            </div>
            <div className={styles.campaignCardGoal}>
                <p>Fundraise goal</p>
                <span className={styles.goal}>{formatMoneyByADAOrDollar(campaign.campaign.requestedMaxADA)}</span>
            </div>
            <div className={styles.campaignCardMinRequest}>
                <div className={styles.medidor}>
                    <div className={styles.progress} style={{ width: progressWidth }}></div>
                </div>
                {(() => {
                    switch (campaign_status_code_id) {
                        case CampaignStatus_Code_Id_Enums.NOT_STARTED:
                        case CampaignStatus_Code_Id_Enums.CREATED:
                        case CampaignStatus_Code_Id_Enums.SUBMITTED:
                        case CampaignStatus_Code_Id_Enums.REJECTED:
                        case CampaignStatus_Code_Id_Enums.APPROVED:
                        case CampaignStatus_Code_Id_Enums.CONTRACT_CREATED:
                        case CampaignStatus_Code_Id_Enums.CONTRACT_PUBLISHED:
                        case CampaignStatus_Code_Id_Enums.CONTRACT_STARTED:
                            return 'The campaign has been created but has not started fundraising yet.';

                        case CampaignStatus_Code_Id_Enums.COUNTDOWN:
                            return `The campaign is preparing to launch. Time remaining: ${formatAllTime(timeRemainingBeginAt)}.`;

                        case CampaignStatus_Code_Id_Enums.FUNDRAISING:
                            return `Minimum collection to activate the campaign ${requestedMinPercentage}%: ${formatMoneyByADAOrDollar(campaign.campaign.requestedMinADA)}.`;

                        case CampaignStatus_Code_Id_Enums.ACTIVE:
                            return `Successfully Fundraising, the campaign is in its ${currentMilestoneStringOrdinal} Milestone.`;

                        case CampaignStatus_Code_Id_Enums.UNREACHED:
                            return 'The campaign has not achieved its funding goal and has not started.';

                        case CampaignStatus_Code_Id_Enums.FAILED:
                            return `The campaign failed to complete its ${currentMilestoneStringOrdinal} Milestone and will not continue.`;

                        case CampaignStatus_Code_Id_Enums.SUCCESS:
                            return 'The campaign has reached its funding goal and has been successfully executed.';
                    }
                })()}
            </div>
        </section>
    );
};

export default CampaignHeaderInfo;
