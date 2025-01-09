import GeneralButtonUI from '@/components/UI/Buttons/UI/Button';
import useDraftCard from '@/hooks/useDraftCard';
import { usePriceStore } from '@/store/price/usepriceAdaOrDollar';
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
import { formatMoney, getOrdinalString } from '@/utils/formats';
import Link from 'next/link';
<<<<<<< HEAD:src/components/CampaignDashboard/sections/dashboard/campaignCard/CardFooter.tsx
import { set } from 'date-fns';
import { useGeneralStore } from '@/store/generalConstants/useGeneralConstants';
=======
import React from 'react';
import styles from './CardFooter.module.scss';
>>>>>>> main:src/components/CampaignDashboard/Sections/Dashboard/CampaignCard/CardFooter.tsx

interface CardFooterProps {
    campaign: any;
}

const CardFooter: React.FC<CardFooterProps> = ({ campaign }) => {
    //! TODO GET BACK SOLO PARA LOS INVERSORES

    const { label, labelClass, currentMilestone, formatAllTime } = useDraftCard(campaign, false, false);
    const { setMenuView } = useProjectDetailStore();
    const { adaPrice } = useGeneralStore();
    const { priceAdaOrDollar } = usePriceStore();
    const { requestMaxAda, cdFundedADA } = campaign;


    const formatMoneyByAdaOrDollar = (value: number) => {
<<<<<<< HEAD:src/components/CampaignDashboard/sections/dashboard/campaignCard/CardFooter.tsx
        if (priceAdaOrDollar === "dollar") {
            return formatMoney(Number(value) / Number(adaPrice), "USD");
        }
        return formatMoney(Number(value), "ADA");
=======
        if (priceAdaOrDollar === 'dollar') {
            return formatMoney(value / price_ada, 'USD');
        }
        return formatMoney(value, 'ADA');
>>>>>>> main:src/components/CampaignDashboard/Sections/Dashboard/CampaignCard/CardFooter.tsx
    };

    const milestonesQuantity = campaign.milestones.length;
    const raisePercentage = Math.min(Number(cdFundedADA) / Number(requestMaxAda) * 100, 100);
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
<<<<<<< HEAD:src/components/CampaignDashboard/sections/dashboard/campaignCard/CardFooter.tsx
                    <StateContainer amount={formatMoneyByAdaOrDollar(requestMaxAda)} subtext="Target Raise" classNameStyle='white' />
=======
                    <StateContainer amount={formatMoneyByAdaOrDollar(goal)} subtext="Target Raise" classNameStyle="white" />
>>>>>>> main:src/components/CampaignDashboard/Sections/Dashboard/CampaignCard/CardFooter.tsx
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
                        <h4 className={styles.fa}>{formatMoneyByAdaOrDollar(cdFundedADA)}</h4>
                        <div className={styles.loaderContainer}>
                            <div className={styles.loader} style={{ width: `${raisePercentage}%` }}></div>
                        </div>
<<<<<<< HEAD:src/components/CampaignDashboard/sections/dashboard/campaignCard/CardFooter.tsx
                        <span>
                            Target Raise:  {formatMoneyByAdaOrDollar(requestMaxAda)}
                        </span>
=======
                        <span>Target Raise: {formatMoneyByAdaOrDollar(goal)}</span>
>>>>>>> main:src/components/CampaignDashboard/Sections/Dashboard/CampaignCard/CardFooter.tsx
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
<<<<<<< HEAD:src/components/CampaignDashboard/sections/dashboard/campaignCard/CardFooter.tsx
                        <StateContainer amount={formatMoneyByAdaOrDollar(cdFundedADA)} subtext="Total Raised" classNameSpan='black' />
=======
                        <StateContainer amount={formatMoneyByAdaOrDollar(raise_amount)} subtext="Total Raised" classNameSpan="black" />
>>>>>>> main:src/components/CampaignDashboard/Sections/Dashboard/CampaignCard/CardFooter.tsx
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
                            Target Raise: <span className={styles.strong}>{formatMoneyByAdaOrDollar(requestMaxAda)}</span>
                        </span>
                    )}
                    <div className={styles.flexRow}>
<<<<<<< HEAD:src/components/CampaignDashboard/sections/dashboard/campaignCard/CardFooter.tsx
                        <StateContainer amount={formatMoneyByAdaOrDollar(cdFundedADA)} subtext="Total Money Raised" classNameStyle='white' />
                        {label === "Unreached" && (
=======
                        <StateContainer amount={formatMoneyByAdaOrDollar(raise_amount)} subtext="Total Money Raised" classNameStyle="white" />
                        {label === 'Unreached' && (
>>>>>>> main:src/components/CampaignDashboard/Sections/Dashboard/CampaignCard/CardFooter.tsx
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
