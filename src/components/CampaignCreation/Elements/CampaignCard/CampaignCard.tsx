import React, { useEffect, useState, useMemo } from 'react';
import ToolTipInformation from '@/components/General/Elements/TooltipInformation/tooltipInformation';
import { usePriceStore } from '@/store/price/usepriceAdaOrDollar';
import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';
import {
    calculatePorcentage,
    formatMoney,
    formatTime,
    getTimeRemaining,
    calculatePorcentagValue,
} from '@/utils/formats';
import { TWO_USERS } from '@/utils/images';
import styles from './CampaignCard.module.scss';
import { useGeneralStore } from '@/store/generalConstants/useGeneralConstants';
import useCampaignCard from "@/components/CampaignCreation/Elements/CampaignCard/useCampaignCard"

interface CampaignCardProps {
    status: string;
    goal: number;
    min_request: number;
    investors?: number;
    startDate: Date | undefined;
    cdFundedADA?: bigint;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ status, goal, min_request, investors, startDate, cdFundedADA }) => {

    const { timeRemaining, progressPercentage, minValuePercantage, progressWidth, stateClass, goalInCurrentCurrency, minValueInCurrentCurrency, currencySymbol, formatAllTime } = useCampaignCard({ startDate, goal, min_request, investors, cdFundedADA })




    return (
        <section className={styles.campaignCard}>
            <div className={styles.campaignCardStatus}>
                <div className={`${styles.statusContainer} ${styles[stateClass]}`}>
                    <span className={`${styles.status} ${styles[stateClass]}`}>
                        {status === 'countdown' ? formatAllTime(timeRemaining) : status}
                    </span>
                    <div className={styles.tooltipContainer}>
                        <ToolTipInformation content="We need to write the explination status by status " />
                    </div>
                </div>
                <div className={styles.investors}>
                    <svg width="15" height="10" className={styles.icon}>
                        <use href={TWO_USERS}></use>
                    </svg>
                    <span className={styles.span}>{investors}</span>
                </div>
            </div>
            <div className={styles.campaignCardGoal}>
                <p>Fundraise goal</p>
                <span className={styles.goal}>{formatMoney(goalInCurrentCurrency, currencySymbol)}</span>
            </div>
            <div className={styles.campaignCardMinRequest}>
                <div className={styles.medidor}>
                    <div className={styles.progress} style={{ width: progressWidth }}></div>
                </div>
                <p>
                    Minimum collection to activate the campaign {minValuePercantage}%:{' '}
                    {formatMoney(minValueInCurrentCurrency, currencySymbol)} { }
                </p>
            </div>
        </section>
    );
};

export default CampaignCard;