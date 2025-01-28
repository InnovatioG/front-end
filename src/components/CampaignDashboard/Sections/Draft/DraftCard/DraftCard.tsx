import React, { useEffect } from 'react';
import styles from "../draftCard/DraftCard.module.scss";
import Link from 'next/link';
import Image from 'next/image';
import GeneralButtonUI from '@/components/UI/Buttons/UI/Button';
import { useModal } from '@/contexts/ModalContext';
import useDraftCard from '@/hooks/useDraftCard';
import type { Campaign } from '@/types/types';
import { CampaignStatus } from '@/utils/constants/status';


interface DraftCardProps {
    campaign: Campaign;
    isProtocolTeam: boolean;
    isAdmin: boolean;
}

const DraftCard: React.FC<DraftCardProps> = ({ campaign, isProtocolTeam, isAdmin }) => {
    const { openModal } = useModal();
    const { label, labelClass, buttons, timeRemaining, formatAllTime, currentMilestone, getInternalId, campaignCategories } = useDraftCard(campaign, isProtocolTeam, isAdmin);




    const categoriesById = (id: number) => {
        return campaignCategories.find((category) => category.id === id)?.name

    }
    const idInternal = getInternalId(campaign.campaign_status_id ?? undefined);



    return (
        <div className={styles.campaignCard}>
            <div className={styles.headCard}>
                <Image
                    width={58}
                    height={58}
                    src={campaign.logo_url && campaign.logo_url || ''}
                    alt="logo-company"
                    className={styles.logoCard}
                />
                <div className={styles.cardDetails}>
                    <div className={styles.statusContracts}>
                        <div className={`${styles.state} ${styles[labelClass]}`}>

                            {idInternal === CampaignStatus.COUNTDOWN ? formatAllTime(timeRemaining) : label}
                            {Number(campaign.campaign_status_id) > CampaignStatus.FUNDRAISING && Number(campaign.campaign_status_id) < CampaignStatus.FAILED && ` ${currentMilestone}`}
                        </div>
                        <div className={styles.category}>
                            {categoriesById(Number(campaign.campaing_category_id))}
                        </div>
                    </div>
                </div>
            </div>
            <h3 className={styles.cardTitle}>{campaign.name}</h3>
            <h3 className={styles.cardDescription}>{campaign.description}</h3>
            <div className={styles.actionsTarget}>
                {buttons.map((button, index) => {
                    if (button.link) {
                        return (
                            <Link key={index} href={button.link(Number(campaign._DB_id))}>
                                <GeneralButtonUI
                                    text={button.label}
                                    onClick={() => button.action && button.action((modalType) => openModal(modalType, /* campaign._DB_id */))}
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
                                onClick={() => button.action && button.action((modalType) => openModal(modalType, /* campaign._DB_id, campaign */))}
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
}

export default DraftCard;

