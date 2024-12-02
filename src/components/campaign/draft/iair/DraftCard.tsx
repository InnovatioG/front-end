import React, { useState, useEffect } from 'react';
import styles from "../draftCard/DraftCard.module.scss";
import { Campaign } from '@/HardCode/databaseType';
import { cardInformationByState, cardInformationForProtocolTeam } from '@/utils/constants';
import Link from 'next/link';
import Image from 'next/image';
import { categoriesById } from '@/utils/constants';
import GeneralButtonUI from '@/components/buttons/UI/Button';
import { formatTime, getTimeRemaining } from '@/utils/formats';
interface DraftCardProps {
    campaign: Campaign;
    isProtocolTeam: boolean;
}

const DraftCard: React.FC<DraftCardProps> = ({ campaign, isProtocolTeam }) => {

    const { label, buttons } = isProtocolTeam
        ? cardInformationForProtocolTeam(campaign.state_id)
        : cardInformationByState(campaign.state_id);

    const labelClass = label.toLowerCase().replace(/\s+/g, '-');

    const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining(campaign.start_date));


    useEffect(() => {
        const timer = setInterval(() => {
            setTimeRemaining(getTimeRemaining(campaign.start_date));
        }, 1000);

        return () => clearInterval(timer);
    }, [campaign.start_date])

    const formatAllTime = (timeRemaining: any) => {
        return `${timeRemaining.days}:${formatTime(timeRemaining.totalHours)}:${formatTime(timeRemaining.minutes)}`;
    }





    return (
        <div className={styles.campaignCard}>
            <div className={styles.headCard}>
                <Image
                    width={58}
                    height={58}
                    src={campaign.logo_url}
                    alt="logo-company"
                    className={styles.logoCard}
                />
                <div className={styles.cardDetails}>
                    <div className={styles.statusContracts}>
                        <div className={`${styles.state} ${styles[labelClass]}`}>
                            {campaign.state_id === 8 ? formatAllTime(timeRemaining) : label}
                        </div>
                        <div className={styles.category}>
                            {categoriesById(campaign.category_id)}
                        </div>
                    </div>
                </div>
            </div>
            <h3 className={styles.cardTitle}>{campaign.title}</h3>
            <h3 className={styles.cardDescription}>{campaign.description}</h3>
            <div className={styles.actionsTarget}>
                {buttons.map((button, index) => (
                    button.link ? (
                        <Link key={index} href={button.link(campaign.id)}>
                            <GeneralButtonUI
                                text={button.label}
                                onClick={() => { }}
                                classNameStyle={`${button.classNameType} ${buttons.length === 1 ? 'center' : ''}`}
                            >
                                {buttons.length > 1 && <span className={styles[button.classNameType]}>{'>'}</span>}
                            </GeneralButtonUI>
                        </Link>
                    ) : (
                        <GeneralButtonUI
                            key={index}
                            text={button.label}
                            onClick={button.action || (() => { })}
                            classNameStyle={`${button.classNameType} ${buttons.length === 1 ? 'center' : ''}`}
                        >
                            {buttons.length > 1 && <span className={styles[button.classNameType]}>{'>'}</span>}
                        </GeneralButtonUI>
                    )
                ))}
            </div>
        </div>
    );
}

export default DraftCard;