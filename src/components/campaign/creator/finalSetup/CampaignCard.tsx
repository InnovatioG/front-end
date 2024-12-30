import React, { useEffect, useState } from 'react';
import styles from "./CampaignCard.module.scss";
import { TWO_USERS } from '@/utils/images';
import { calculatePorcentage, formatMoney } from '@/utils/formats';
import ToolTipInformation from '@/components/general/tooltipInformation/tooltipInformation';
import { getTimeRemaining, formatTime } from '@/utils/formats';
import { usePriceStore } from '@/store/price/usepriceAdaOrDollar';
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';

interface CampaignCardProps {
    status: string;
    goal: number;
    min_request: number;
    investors: number;
    startDate: string;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ status, goal, min_request, investors, startDate }) => {
    const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining(startDate));
    const { priceAdaOrDollar } = usePriceStore();
    const { price_ada, fetchAdaPrice, isAdmin, isProtocolTeam } = useProjectDetailStore();

    useEffect(() => {
        fetchAdaPrice();

        const timer = setInterval(() => {
            setTimeRemaining(getTimeRemaining(startDate));
        }, 1000);

        return () => clearInterval(timer);
    }, [startDate, fetchAdaPrice]);

    const formatAllTime = (timeRemaining: any) => {
        return `${timeRemaining.days}:${formatTime(timeRemaining.totalHours)}:${formatTime(timeRemaining.minutes)}`;
    };

    const progressWidth = `${min_request}%`;
    const stateClass = status.toLowerCase().replace(/\s+/g, '-');

    const goalInCurrentCurrency = priceAdaOrDollar === 'dollar' ? goal : goal / price_ada;
    const currencySymbol = priceAdaOrDollar === 'dollar' ? 'USD' : 'ADA';




    return (
        <section className={styles.campaignCard}>
            <div className={styles.campaignCardStatus}>
                <div className={`${styles.statusContainer} ${styles[stateClass]}`}>

                    <span className={`${styles.status} ${styles[stateClass]}`}>
                        {status === "countdown" ? formatAllTime(timeRemaining) : status}
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
                <p>Minimum collection to activate the campaign {min_request}%: {formatMoney(calculatePorcentage(goalInCurrentCurrency, min_request), currencySymbol)}</p>
            </div>
        </section>
    );
}

export default CampaignCard;