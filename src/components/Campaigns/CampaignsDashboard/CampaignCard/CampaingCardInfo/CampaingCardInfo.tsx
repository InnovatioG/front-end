import { CampaignEX } from '@/types/types';
import { CampaignStatus_Code_Id_Enums } from '@/utils/constants/status/status';
import React from 'react';
import styles from './CampaingCardInfo.module.scss';
import { ICampaignDetails } from '@/hooks/useCampaingDetails';
import { CampaignTabEnum, ROUTES } from '@/utils/constants/routes';
import Link from 'next/link';
import { formatMoneyByADAOrDollar } from '@/store/generalStore/useGeneralStore';

interface CampaingCardInfoProps {
    campaign: CampaignEX;
}

const CampaingCardInfoInfo: React.FC<CampaingCardInfoProps & ICampaignDetails> = (props: CampaingCardInfoProps & ICampaignDetails) => {
    const { campaign, label, labelClass, campaign_status_code_id, currentMilestoneStringOrdinal, totalMilestones, fundedPercentage } = props;

    console.log('CampaingCardInfoInfo', campaign, label, labelClass, campaign_status_code_id, currentMilestoneStringOrdinal, totalMilestones, fundedPercentage);

    const StateContainer = ({ amount, subtext, classNameStyle }: { amount: string; subtext: string; classNameStyle?: string }) => (
        <div className={`${styles.status} ${styles[labelClass]}`}>
            <h4 className={`${styles.money}  ${classNameStyle && styles[classNameStyle]}`}>{amount}</h4>
            <span className={`${styles.span} ${classNameStyle && styles[classNameStyle]} `}>{subtext}</span>
        </div>
    );

    return (
        <div>
            {campaign_status_code_id === CampaignStatus_Code_Id_Enums.COUNTDOWN && (
                <div className={styles.container}>
                    <div className={styles.flexRow}>
                       <StateContainer amount={formatMoneyByADAOrDollar(campaign.campaign.requestedMaxADA)} subtext="Target Raise" classNameStyle="white" />
                    </div>
                    <Link href={`${ROUTES.campaignViewTab(campaign.campaign._DB_id, CampaignTabEnum.ROADMAP)}`}>
                        <div className={`${styles.footer} ${styles.link}`}>
                            <div className={styles.milestonesQuant}>
                                <h4>
                                    {totalMilestones} {totalMilestones === 1 ? 'milestone' : 'milestones'}
                                </h4>
                            </div>
                        </div>
                    </Link>
                </div>
            )}

            {campaign_status_code_id === CampaignStatus_Code_Id_Enums.FUNDRAISING && (
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

            {campaign_status_code_id === CampaignStatus_Code_Id_Enums.ACTIVE && (
                <div className={styles.container}>
                    <div className={`${styles.flexRow} ${styles.flexRow2}`}>
                        <StateContainer amount={formatMoneyByADAOrDollar(campaign.campaign.cdFundedADA)} subtext="Total Raised" classNameStyle="black" />
                        <Link href={`${ROUTES.campaignViewTab(campaign.campaign._DB_id, CampaignTabEnum.ROADMAP)}`}>
                            <div className={`${styles.ordinalString} ${styles.link}`}>
                                <span className={styles.ordinal}>
                                    <p className={styles.milestone}>{currentMilestoneStringOrdinal}</p>
                                    milestone
                                </span>
                            </div>
                        </Link>
                    </div>
                </div>
            )}

            {campaign_status_code_id === CampaignStatus_Code_Id_Enums.SUCCESS && (
                <div className={styles.container}>
                    <div className={`${styles.flexRow} ${styles.flexRow2}`}>
                        <StateContainer amount={formatMoneyByADAOrDollar(campaign.campaign.cdFundedADA)} subtext="Total Raised" classNameStyle="black" />
                        <Link href={`${ROUTES.campaignViewTab(campaign.campaign._DB_id, CampaignTabEnum.ROADMAP)}`}>
                            <div className={`${styles.ordinalString} ${styles.link}`}>
                                <span className={styles.ordinal}>
                                    <p className={styles.milestone}>{currentMilestoneStringOrdinal}</p>
                                    milestone
                                </span>
                            </div>
                        </Link>
                    </div>
                </div>
            )}

            {(campaign_status_code_id === CampaignStatus_Code_Id_Enums.UNREACHED || campaign_status_code_id === CampaignStatus_Code_Id_Enums.FAILED) && (
                <div className={styles.container}>
                    {campaign_status_code_id === CampaignStatus_Code_Id_Enums.UNREACHED && (
                        <div className={styles.header}>
                            Target Raise: <span className={styles.strong}>{formatMoneyByADAOrDollar(campaign.campaign.requestedMaxADA)}</span>
                        </div>
                    )}
                    <div className={`${styles.flexRow} ${styles.flexRow2}`}>
                        <StateContainer amount={formatMoneyByADAOrDollar(campaign.campaign.cdFundedADA)} subtext="Total Raised" classNameStyle="white" />
                        {campaign_status_code_id === CampaignStatus_Code_Id_Enums.UNREACHED && (
                            <div className={styles.ordinalString}>
                                <span className={styles.ordinal}>
                                    <span className={styles.milestone}>{fundedPercentage}%</span>
                                    Raised
                                </span>
                            </div>
                        )}
                        {campaign_status_code_id === CampaignStatus_Code_Id_Enums.FAILED && (
                            <Link href={`${ROUTES.campaignViewTab(campaign.campaign._DB_id, CampaignTabEnum.ROADMAP)}`}>
                                <div className={`${styles.ordinalString} ${styles.link}`}>
                                    <span className={styles.ordinal}>
                                        <p className={styles.milestone}>{currentMilestoneStringOrdinal}</p>
                                        milestone
                                    </span>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>
            )}

            {campaign_status_code_id !== CampaignStatus_Code_Id_Enums.COUNTDOWN &&
                campaign_status_code_id !== CampaignStatus_Code_Id_Enums.FUNDRAISING &&
                campaign_status_code_id !== CampaignStatus_Code_Id_Enums.ACTIVE &&
                campaign_status_code_id !== CampaignStatus_Code_Id_Enums.SUCCESS &&
                campaign_status_code_id !== CampaignStatus_Code_Id_Enums.UNREACHED &&
                campaign_status_code_id !== CampaignStatus_Code_Id_Enums.FAILED && (
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
