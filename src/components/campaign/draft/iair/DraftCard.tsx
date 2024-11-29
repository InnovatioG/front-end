import React from 'react';
import styles from "../draftCard/DraftCard.module.scss";
import { Campaign } from '@/HardCode/databaseType';
import { cardInformationByState } from '@/utils/constants';
import Link from 'next/link';

interface DraftCardProps {
    campaign: Campaign;
}

const DraftCard: React.FC<DraftCardProps> = ({ campaign }) => {
    const { label, buttons } = cardInformationByState(campaign.state_id);

    return (
        <div className={styles.campaignCard}>
            <span className={`${styles.state} ${styles[label.toLowerCase()]}`}>
                {label}
            </span>
            <div className={styles.buttons}>
                {buttons.map((button, index) => (
                    button.link ? (
                        <Link key={index} href={button.link(campaign.id)}>
                            <a className={styles.button}>{button.label}</a>
                        </Link>
                    ) : (
                        <button key={index} onClick={button.action} className={styles.button}>
                            {button.label}
                        </button>
                    )
                ))}
            </div>
        </div>
    );
}

export default DraftCard;