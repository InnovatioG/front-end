import { CampaignEX } from '@/types/types';
import { CampaignStatus_Code_Id } from '@/utils/constants/status';
import React from 'react';
import styles from './CampaingCardInfo.module.scss';
import { ICampaignDetails } from '@/hooks/useCampaingDetails';

interface CampaingCardInfoProps {
    campaign: CampaignEX;
}

const CampaingCardInfoInfo: React.FC<CampaingCardInfoProps & ICampaignDetails> = (props: CampaingCardInfoProps & ICampaignDetails) => {
    
    const { campaign, label, labelClass, campaign_status_code_id, currentMilestoneStringOrdinal, totalMilestones, fundedPercentage, formatMoneyByADAOrDollar } = props;

    const StateContainer = ({ amount, subtext, classNameStyle }: { amount: string; subtext: string; classNameStyle?: string }) => (
        <div className={`${styles.status} ${styles[labelClass]}`}>
            <h4 className={`${styles.money}  ${classNameStyle && styles[classNameStyle]}`}>{amount}</h4>
            <span className={`${styles.span} ${classNameStyle && styles[classNameStyle]} `}>{subtext}</span>
        </div>
    );

    return (
        <div>
            {campaign_status_code_id === CampaignStatus_Code_Id.COUNTDOWN && (
                <div className={styles.container}>
                    <div className={styles.flexRow}>
                        <StateContainer amount={formatMoneyByADAOrDollar(campaign.campaign.requestedMaxADA)} subtext="Target Raise" classNameStyle="white" />
                    </div>

                    <div className={styles.footer}>
                        <div className={styles.milestonesQuant}>
                            <h4>
                                {totalMilestones} {totalMilestones === 1 ? 'milestone' : 'milestones'}
                            </h4>
                        </div>
                    </div>
                </div>
            )}

            {campaign_status_code_id === CampaignStatus_Code_Id.FUNDRAISING && (
                <div className={styles.container}>
                    <div className={styles.flexRow}>
                        <div className={`${styles.status} ${styles.light}`}>
                            <h4 className={`${styles.money} ${styles.black}`}>{formatMoneyByADAOrDollar(campaign.campaign.cdFundedADA)}</h4>
                            <div className={styles.loaderContainer}>
                                <div className={styles.loader} style={{ width: `${fundedPercentage}%` }}></div>
                            </div>
                            <span className={`${styles.span} ${styles.black}`}>Target Raise: {formatMoneyByADAOrDollar(campaign.campaign.requestedMaxADA)}</span>
                        </div>
                    </div>
                </div>
            )}

            {campaign_status_code_id === CampaignStatus_Code_Id.ACTIVE && (
                <div className={styles.container}>
                    <div className={`${styles.flexRow} ${styles.flexRow2}`}>
                        <StateContainer amount={formatMoneyByADAOrDollar(campaign.campaign.cdFundedADA)} subtext="Total Raised" classNameStyle="black" />
                        <div className={styles.ordinalString}>
                            <span className={styles.ordinal}>
                                <p className={styles.milestone}>{currentMilestoneStringOrdinal}</p>
                                milestone
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {campaign_status_code_id === CampaignStatus_Code_Id.SUCCESS && (
                <div className={styles.container}>
                    <div className={`${styles.flexRow} ${styles.flexRow2}`}>
                        <StateContainer amount={formatMoneyByADAOrDollar(campaign.campaign.cdFundedADA)} subtext="Total Raised" classNameStyle="black" />
                        <div className={styles.ordinalString}>
                            <span className={styles.ordinal}>
                                <p className={styles.milestone}>{currentMilestoneStringOrdinal}</p>
                                milestone
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {(campaign_status_code_id === CampaignStatus_Code_Id.UNREACHED || campaign_status_code_id === CampaignStatus_Code_Id.FAILED) && (
                <div className={styles.container}>
                    {campaign_status_code_id === CampaignStatus_Code_Id.UNREACHED && (
                        <div className={styles.header}>
                            Target Raise: <span className={styles.strong}>{formatMoneyByADAOrDollar(campaign.campaign.requestedMaxADA)}</span>
                        </div>
                    )}
                    <div className={`${styles.flexRow} ${styles.flexRow2}`}>
                        <StateContainer amount={formatMoneyByADAOrDollar(campaign.campaign.cdFundedADA)} subtext="Total Raised" classNameStyle="white" />
                        {campaign_status_code_id === CampaignStatus_Code_Id.UNREACHED && (
                            <div className={styles.ordinalString}>
                                <span className={styles.ordinal}>
                                    <span className={styles.milestone}>{fundedPercentage}%</span>
                                    Raised
                                </span>
                            </div>
                        )}
                        {campaign_status_code_id === CampaignStatus_Code_Id.FAILED && (
                            <div className={styles.ordinalString}>
                                <span className={styles.ordinal}>
                                    <p className={styles.milestone}>{currentMilestoneStringOrdinal}</p>
                                    milestone
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {campaign_status_code_id !== CampaignStatus_Code_Id.COUNTDOWN &&
                campaign_status_code_id !== CampaignStatus_Code_Id.FUNDRAISING &&
                campaign_status_code_id !== CampaignStatus_Code_Id.ACTIVE &&
                campaign_status_code_id !== CampaignStatus_Code_Id.SUCCESS &&
                campaign_status_code_id !== CampaignStatus_Code_Id.UNREACHED &&
                campaign_status_code_id !== CampaignStatus_Code_Id.FAILED && (
                    <div className={styles.container}>
                        <div className={`${styles.flexRow} `}>
                            <div className={`${styles.status} ${styles.transparemt}`}>
                                <div></div>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    );
};

export default CampaingCardInfoInfo;
