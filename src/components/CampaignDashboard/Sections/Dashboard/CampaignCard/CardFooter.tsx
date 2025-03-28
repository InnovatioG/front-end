import GeneralButtonUI from '@/components/UI/Buttons/UI/Button';
import useDraftCard from '@/hooks/useDraftCard';
import { usePriceStore } from '@/store/price/usepriceAdaOrDollar';
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
import { formatMoney, getOrdinalString } from '@/utils/formats';
import Link from 'next/link';
import React from 'react';
import styles from './CardFooter.module.scss';

interface CardFooterProps {
    campaign: any;
}

const CardFooter: React.FC<CardFooterProps> = ({ campaign }) => {
    //! TODO GET BACK SOLO PARA LOS INVERSORES

    const { label, labelClass, currentMilestone, formatAllTime } = useDraftCard(campaign, false, false);
    const { fetchAdaPrice, price_ada, setMenuView } = useProjectDetailStore();
    const { priceAdaOrDollar } = usePriceStore();
    const { goal, raise_amount } = campaign;

    const formatMoneyByAdaOrDollar = (value: number) => {
        if (priceAdaOrDollar === 'dollar') {
            return formatMoney(value / price_ada, 'USD');
        }
        return formatMoney(value, 'ADA');
    };

    const milestonesQuantity = campaign.milestones.length;
    const raisePercentage = Math.min((raise_amount / goal) * 100, 100);
    const numberFromCurrentMilestone = getOrdinalString(Number(currentMilestone.charAt(1)));

    // Reusable components
    const StateContainer = ({ amount, subtext, classNameStyle, classNameSpan }: { amount: string; subtext: string; classNameStyle?: string; classNameSpan?: string }) => (
        <div className={`${styles.stateContainer} ${styles[labelClass]}`}>
            <h4 className={`${styles.goalFundraising}  ${classNameStyle && styles[classNameStyle]}`}>{amount}</h4>
            <span className={`${styles.span} ${classNameSpan && styles[classNameSpan]} `}>{subtext}</span>
        </div>
    );

    return (
        <div>
            {label === 'Countdown' && (
                <div className={styles.container}>
                    <StateContainer amount={formatMoneyByAdaOrDollar(goal)} subtext="Target Raise" classNameStyle="white" />
                    <div className={styles.footer}>
                        <div className={styles.milestonesQuant}>
                            <h4>
                                {milestonesQuantity} {milestonesQuantity === 1 ? 'milestone' : 'milestones'}
                            </h4>
                        </div>
                        <Link href={`/campaign/${campaign.id}`}>
                            <GeneralButtonUI text="Learn more" classNameStyle="fillb" onClick={() => {}} />
                        </Link>
                    </div>
                </div>
            )}

            {label === 'Fundraising' && (
                <div className={styles.container}>
                    <div className={`${styles.stateContainer} ${styles[labelClass]}`}>
                        <h4 className={styles.fa}>{formatMoneyByAdaOrDollar(raise_amount)}</h4>
                        <div className={styles.loaderContainer}>
                            <div className={styles.loader} style={{ width: `${raisePercentage}%` }}></div>
                        </div>
                        <span>Target Raise: {formatMoneyByAdaOrDollar(goal)}</span>
                    </div>
                    <div className={styles.footer}>
                        <Link href={`/campaign/${campaign.id}`}>
                            <GeneralButtonUI
                                text={'Learn more'}
                                classNameStyle={'fillb'}
                                onClick={() => {
                                    setMenuView('Roadmap & Milestones');
                                }}
                            />
                        </Link>

                        <Link href={`/invest?id=${campaign.id}`}>
                            <GeneralButtonUI text={'Invest'} classNameStyle={'invest'} onClick={() => {}} />
                        </Link>
                    </div>
                </div>
            )}

            {label === 'Active' && (
                <div className={styles.container}>
                    <div className={styles.flexRow}>
                        <StateContainer amount={formatMoneyByAdaOrDollar(raise_amount)} subtext="Total Raised" classNameSpan="black" />
                        <div className={styles.ordinalString}>
                            <span className={styles.ordinal}>
                                <p className={styles.goalFundraising}>{numberFromCurrentMilestone}</p>
                                milestone
                            </span>
                        </div>
                    </div>

                    <div className={styles.footer}>
                        <Link href={`/campaign/${campaign.id}`}>
                            <GeneralButtonUI
                                text={'View Roadmap'}
                                classNameStyle={'fillb'}
                                onClick={() => {
                                    setMenuView('Roadmap & Milestones');
                                }}
                            />
                        </Link>

                        <Link href={`/campaign/${campaign.id}`}>
                            <GeneralButtonUI text={'Learn More'} classNameStyle={'Learn More'} onClick={() => {}} />
                        </Link>
                    </div>
                </div>
            )}

            {(label === 'Unreached' || label === 'Failed') && (
                <div className={styles.container}>
                    {label === 'Unreached' && (
                        <span>
                            Target Raise: <span className={styles.strong}>{formatMoneyByAdaOrDollar(goal)}</span>
                        </span>
                    )}
                    <div className={styles.flexRow}>
                        <StateContainer amount={formatMoneyByAdaOrDollar(raise_amount)} subtext="Total Money Raised" classNameStyle="white" />
                        {label === 'Unreached' && (
                            <div className={styles.percentage}>
                                <span className={styles.goalFundraising}>{raisePercentage}%</span>
                                <span> Raised</span>
                            </div>
                        )}
                        {label === 'Failed' && (
                            <div className={styles.ordinalString}>
                                <span className={styles.ordinal}>
                                    <p className={styles.goalFundraising}>{numberFromCurrentMilestone}</p>
                                    milestone
                                </span>
                            </div>
                        )}
                    </div>

                    <div className={styles.footer}>
                        <Link href={`/campaign/${campaign.id}`}>
                            <GeneralButtonUI
                                text={'Learn more'}
                                classNameStyle={'fillb'}
                                onClick={() => {
                                    setMenuView('Roadmap & Milestones');
                                }}
                            />
                        </Link>
                        <GeneralButtonUI text={'Get Back'} classNameStyle={label} onClick={() => {}} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CardFooter;
