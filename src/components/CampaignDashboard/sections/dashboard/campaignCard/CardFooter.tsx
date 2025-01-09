import React from 'react';
import useDraftCard from "@/hooks/useDraftCard";
import styles from "./CardFooter.module.scss";
import { formatMoney, getOrdinalString } from '@/utils/formats';
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
import { usePriceStore } from '@/store/price/usepriceAdaOrDollar';
import GeneralButtonUI from '@/components/ui/buttons/UI/Button';
import Link from 'next/link';
import { set } from 'date-fns';
import { useGeneralStore } from '@/store/generalConstants/useGeneralConstants';

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
        if (priceAdaOrDollar === "dollar") {
            return formatMoney(Number(value) / Number(adaPrice), "USD");
        }
        return formatMoney(Number(value), "ADA");
    };

    const milestonesQuantity = campaign.milestones.length;
    const raisePercentage = Math.min(Number(cdFundedADA) / Number(requestMaxAda) * 100, 100);
    const numberFromCurrentMilestone = getOrdinalString(Number(currentMilestone.charAt(1)));

    // Reusable components
    const StateContainer = ({ amount, subtext, classNameStyle, classNameSpan }: { amount: string; subtext: string, classNameStyle?: string, classNameSpan?: string }) => (
        <div className={`${styles.stateContainer} ${styles[labelClass]}`}>
            <h4 className={`${styles.goalFundraising}  ${classNameStyle && styles[classNameStyle]}`}>{amount}</h4>
            <span className={`${styles.span} ${classNameSpan && styles[classNameSpan]} `}>{subtext}</span>
        </div>
    );



    return (
        <div>
            {label === "Countdown" && (
                <div className={styles.container}>
                    <StateContainer amount={formatMoneyByAdaOrDollar(requestMaxAda)} subtext="Target Raise" classNameStyle='white' />
                    <div className={styles.footer}>
                        <div className={styles.milestonesQuant}>
                            <h4>{milestonesQuantity} {milestonesQuantity === 1 ? "milestone" : "milestones"}</h4>
                        </div>
                        <Link href={`/campaign/${campaign.id}`}>
                            <GeneralButtonUI text="Learn more" classNameStyle="fillb" onClick={() => { }} />
                        </Link>
                    </div>
                </div>
            )}

            {label === "Fundraising" && (
                <div className={styles.container}>
                    <div className={`${styles.stateContainer} ${styles[labelClass]}`}>
                        <h4 className={styles.fa}>{formatMoneyByAdaOrDollar(cdFundedADA)}</h4>
                        <div className={styles.loaderContainer}>
                            <div className={styles.loader} style={{ width: `${raisePercentage}%` }}></div>
                        </div>
                        <span>
                            Target Raise:  {formatMoneyByAdaOrDollar(requestMaxAda)}
                        </span>
                    </div>
                    < div className={styles.footer} >
                        <Link href={`/campaign/${campaign.id}`}>
                            <GeneralButtonUI text={"Learn more"} classNameStyle={"fillb"} onClick={() => { setMenuView("Roadmap & Milestones") }} />
                        </Link>


                        <Link href={`/invest?id=${campaign.id}`}>
                            <GeneralButtonUI
                                text={"Invest"}
                                classNameStyle={"invest"}
                                onClick={() => { }}
                            />
                        </Link>


                    </ div>
                </div>
            )}

            {label === "Active" && (
                <div className={styles.container}>
                    <div className={styles.flexRow}>
                        <StateContainer amount={formatMoneyByAdaOrDollar(cdFundedADA)} subtext="Total Raised" classNameSpan='black' />
                        <div className={styles.ordinalString}>
                            <span className={styles.ordinal}>
                                <p className={styles.goalFundraising}>{numberFromCurrentMilestone}</p>
                                milestone
                            </span>
                        </div>
                    </div>

                    < div className={styles.footer} >
                        <Link href={`/campaign/${campaign.id}`}>
                            <GeneralButtonUI text={"View Roadmap"} classNameStyle={"fillb"} onClick={() => { setMenuView("Roadmap & Milestones") }} />
                        </Link>


                        <Link href={`/campaign/${campaign.id}`}>
                            <GeneralButtonUI
                                text={"Learn More"}
                                classNameStyle={"Learn More"}
                                onClick={() => { }}
                            />
                        </Link>


                    </ div>
                </div>
            )}

            {(label === "Unreached" || label === "Failed") && (
                <div className={styles.container}>
                    {label === "Unreached" &&
                        <span>
                            Target Raise: <span className={styles.strong}>{formatMoneyByAdaOrDollar(requestMaxAda)}</span>
                        </span>
                    }
                    <div className={styles.flexRow}>
                        <StateContainer amount={formatMoneyByAdaOrDollar(cdFundedADA)} subtext="Total Money Raised" classNameStyle='white' />
                        {label === "Unreached" && (
                            <div className={styles.percentage}>
                                <span className={styles.goalFundraising}>{raisePercentage}%</span>
                                <span> Raised</span>
                            </div>
                        )}
                        {label === "Failed" && (
                            <div className={styles.ordinalString}>
                                <span className={styles.ordinal}>
                                    <p className={styles.goalFundraising}>{numberFromCurrentMilestone}</p>
                                    milestone
                                </span>
                            </div>
                        )}
                    </div>

                    < div className={styles.footer} >
                        <Link href={`/campaign/${campaign.id}`}>
                            <GeneralButtonUI text={"Learn more"} classNameStyle={"fillb"} onClick={() => { setMenuView("Roadmap & Milestones") }} />
                        </Link>
                        <GeneralButtonUI text={"Get Back"} classNameStyle={label} onClick={() => { }} />
                    </ div>
                </div>
            )}
        </div>
    );
};

export default CardFooter;