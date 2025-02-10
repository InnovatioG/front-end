import ToolTipInformation from '@/components/General/TooltipInformation/tooltipInformation';
import { ICampaignDetails } from '@/hooks/useCampaingDetails';
import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import { TWO_USERS } from '@/utils/constants/images';
import { CampaignStatus_Code_Id } from '@/utils/constants/status';
import React from 'react';
import styles from './CampaignHeaderInfo.module.scss';

const CampaignHeaderInfo: React.FC<ICampaignIdStoreSafe & ICampaignDetails> = (props: ICampaignIdStoreSafe & ICampaignDetails) => {
    const {
        campaign,
        label,
        labelClass,
        campaign_status_code_id,
        timeRemainingBeginAt,
        formatAllTime,
        currentMilestoneStringOrdinal,
        requestedMinPercentage,
        progressWidth,
        requestedMaxInCurrentCurrency,
        currencySymbol,
        formatMoneyByADAOrDollar,
    } = props;

    return (
        <section className={styles.campaignCard}>
            <div className={styles.campaignCardStatus}>
                <div className={`${styles.statusContainer} ${styles[labelClass]}`}>
                    <span className={`${styles.status} ${styles[labelClass]}`}>
                        {campaign_status_code_id === CampaignStatus_Code_Id.COUNTDOWN ? formatAllTime(timeRemainingBeginAt) : label}
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
                        case CampaignStatus_Code_Id.NOT_STARTED:
                        case CampaignStatus_Code_Id.CREATED:
                        case CampaignStatus_Code_Id.SUBMITTED:
                        case CampaignStatus_Code_Id.REJECTED:
                        case CampaignStatus_Code_Id.APPROVED:
                        case CampaignStatus_Code_Id.CONTRACT_CREATED:
                        case CampaignStatus_Code_Id.CONTRACT_PUBLISHED:
                        case CampaignStatus_Code_Id.CONTRACT_STARTED:
                            return 'The campaign has been created but has not started fundraising yet.';

                        case CampaignStatus_Code_Id.COUNTDOWN:
                            return `The campaign is preparing to launch. Time remaining: ${formatAllTime(timeRemainingBeginAt)}.`;

                        case CampaignStatus_Code_Id.FUNDRAISING:
                            return `Minimum collection to activate the campaign ${requestedMinPercentage}%: ${formatMoneyByADAOrDollar(campaign.campaign.requestedMinADA)}.`;

                        case CampaignStatus_Code_Id.ACTIVE:
                            return `Successfully Fundraising, the campaign is in its ${currentMilestoneStringOrdinal} Milestone.`;

                        case CampaignStatus_Code_Id.UNREACHED:
                            return 'The campaign has not achieved its funding goal and has not started.';

                        case CampaignStatus_Code_Id.FAILED:
                            return `The campaign failed to complete its ${currentMilestoneStringOrdinal} Milestone and will not continue.`;

                        case CampaignStatus_Code_Id.SUCCESS:
                            return 'The campaign has reached its funding goal and has been successfully executed.';
                    }
                })()}
            </div>
        </section>
    );
};

export default CampaignHeaderInfo;
