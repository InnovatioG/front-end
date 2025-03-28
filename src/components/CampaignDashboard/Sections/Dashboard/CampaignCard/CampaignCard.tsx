import CardFooter from '@/components/CampaignDashboard/Sections/Dashboard/CampaignCard/CardFooter';
import { Campaign } from '@/HardCode/databaseType';
import useDraftCard from '@/hooks/useDraftCard';
import { getTimeRemaining } from '@/utils/formats';
import { TWO_USERS } from '@/utils/images';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from './CampaignCard.module.scss';

interface CampaignCardProps {
    campaign: Campaign;
    getStatusName: (statusId: number) => string;
    getCategoryName: (category_id: number) => string;
}

export default function CampaignCard(props: CampaignCardProps) {
    const { campaign, getStatusName, getCategoryName } = props;
    const [timeRemaining, setTimeRemaining] = useState(campaign.end_date ? getTimeRemaining(campaign.end_date) : { total: 0, days: 0, totalHours: 0, minutes: 0 });

    const { label, labelClass, currentMilestone, formatAllTime } = useDraftCard(campaign, false, false);

    useEffect(() => {
        const timer = setInterval(() => {
            if (campaign.end_date) {
                setTimeRemaining(getTimeRemaining(campaign.end_date));
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [campaign.end_date]);

    return (
        <div className={styles.campaignCard}>
            <div className={styles.headCard}>
                <Image width={58} height={58} src={campaign.logo_url} alt="logo-company" className={styles.logoCard} />
                <div className={styles.cardDetails}>
                    <div className={styles.status}>
                        <div className={`${styles.state} ${styles[labelClass]}`}>{campaign.state_id === 8 ? formatAllTime(timeRemaining) : label}</div>
                        <div className={styles.category}>{getCategoryName(campaign.category_id)}</div>
                    </div>
                    <div className={styles.investors}>
                        <svg width="12" height="12" className={styles.icon}>
                            <use href={TWO_USERS}></use>
                        </svg>
                        <p className={styles.cant}>{campaign.investors}</p>
                    </div>
                </div>
            </div>
            <h3 className={styles.cardTitle}>{campaign.title}</h3>
            <p className={styles.cardDescription}>{campaign.description}</p>
            <CardFooter campaign={campaign} />
        </div>
    );
}
