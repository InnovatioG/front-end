import GeneralButtonUI from '@/components/UI/Buttons/UI/Button';
import { useModal } from '@/contexts/ModalContext';
import { Campaign } from '@/HardCode/databaseType';
import useDraftCard from '@/hooks/useDraftCard';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import styles from '../DraftCard/DraftCard.module.scss';

interface DraftCardProps {
    campaign: Campaign;
    isProtocolTeam: boolean;
    isAdmin: boolean;
}

const DraftCard: React.FC<DraftCardProps> = ({ campaign, isProtocolTeam, isAdmin }) => {
    const { openModal } = useModal();
    const { label, labelClass, buttons, timeRemaining, formatAllTime, currentMilestone } = useDraftCard(campaign, isProtocolTeam, isAdmin);

    const categoriesById = (id: number) => {
        return 'TODO';
    };

    return (
        <div className={styles.campaignCard}>
            <span>{campaign.id}</span>
            <div className={styles.headCard}>
                <Image width={58} height={58} src={campaign.logo_url} alt="logo-company" className={styles.logoCard} />
                <div className={styles.cardDetails}>
                    <div className={styles.statusContracts}>
                        <div className={`${styles.state} ${styles[labelClass]}`}>
                            {campaign.state_id === 8 ? formatAllTime(timeRemaining) : label}
                            {campaign.state_id > 9 && campaign.state_id < 12 && ` ${currentMilestone}`}
                        </div>
                        <div className={styles.category}>{categoriesById(campaign.category_id)}</div>
                    </div>
                </div>
            </div>
            <h3 className={styles.cardTitle}>{campaign.title}</h3>
            <h3 className={styles.cardDescription}>{campaign.description}</h3>
            <div className={styles.actionsTarget}>
                {buttons.map((button, index) => {
                    if (button.link) {
                        return (
                            <Link key={index} href={button.link(campaign.id)}>
                                <GeneralButtonUI
                                    text={button.label}
                                    onClick={() => button.action && button.action((modalType) => openModal(modalType, { campaign_id: campaign.id }))}
                                    classNameStyle={`${button.classNameType} ${buttons.length === 1 ? 'center' : ''}`}
                                >
                                    {buttons.length > 1 && <span className={styles[button.classNameType]}>{'>'}</span>}
                                </GeneralButtonUI>
                            </Link>
                        );
                    } else {
                        return (
                            <GeneralButtonUI
                                key={index}
                                text={button.label}
                                onClick={() => button.action && button.action((modalType) => openModal(modalType, { campaign_id: campaign.id, campaign }))}
                                classNameStyle={`${button.classNameType} ${buttons.length === 1 ? 'center' : ''}`}
                            >
                                {buttons.length > 1 && <span className={styles[button.classNameType]}>{'>'}</span>}
                            </GeneralButtonUI>
                        );
                    }
                })}
            </div>
        </div>
    );
};

export default DraftCard;
