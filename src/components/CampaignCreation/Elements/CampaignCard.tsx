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

interface CampaignCardProps {
    status: string;
    goal: number;
    min_request: number;
    investors?: number;
    startDate: Date | undefined;
    cdFundedADA?: bigint;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ status, goal, min_request, investors, startDate, cdFundedADA }) => {
    const [timeRemaining, setTimeRemaining] = useState(() => getTimeRemaining(startDate));
    const { adaPrice } = useGeneralStore();
    const { priceAdaOrDollar } = usePriceStore();
    const { isAdmin, isProtocolTeam } = useCampaignIdStore();

    const progressPercentage = useMemo(() => calculatePorcentagValue(goal, Number(cdFundedADA)), [goal, cdFundedADA]);
    const minValuePercantage = useMemo(() => calculatePorcentagValue(goal, min_request), [min_request, goal]);
    const progressWidth = `${progressPercentage}%`;
    const stateClass = useMemo(() => status.toLowerCase().replace(/\s+/g, '-'), [status]);
    const goalInCurrentCurrency = useMemo(
        () => (priceAdaOrDollar === 'dollar' ? Number(goal) : Number(goal) / adaPrice),
        [priceAdaOrDollar, goal, adaPrice]
    );
    const minValueInCurrentCurrency = useMemo(
        () => (priceAdaOrDollar === 'dollar' ? Number(min_request) : Number(min_request) / adaPrice),
        [priceAdaOrDollar, min_request, adaPrice]
    )
    const currencySymbol = useMemo(() => (priceAdaOrDollar === 'dollar' ? 'USD' : 'ADA'), [priceAdaOrDollar]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeRemaining(getTimeRemaining(startDate));
        }, 1000);

        return () => clearInterval(timer);
    }, [startDate]);

    const formatAllTime = (timeRemaining: any) => {
        return `${timeRemaining.days}:${formatTime(timeRemaining.totalHours)}:${formatTime(timeRemaining.minutes)}`;
    };

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