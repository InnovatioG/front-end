import styles from './CampaignCard.module.scss';
import Image from 'next/image';
import type { Campaign } from '@/types/types';
import { TWO_USERS } from '@/utils/images';
import { useEffect, useState } from 'react';
import { formatTime, getTimeRemaining } from '@/utils/formats';
import useDraftCard from '@/hooks/useDraftCard';
import CardFooter from '@/components/CampaignDashboard/Sections/Dashboard/CampaignCard/CardFooter';
import { useGeneralStore } from '@/store/generalConstants/useGeneralConstants';

interface CampaignCardProps {
    campaign: Campaign;

}

export default function CampaignCard(props: CampaignCardProps) {
    const { campaign } = props;
    const [timeRemaining, setTimeRemaining] = useState(campaign.deadline ? getTimeRemaining(campaign.deadline) : { total: 0, days: 0, totalHours: 0, minutes: 0 });
    const { label, labelClass, currentMilestone, formatAllTime } = useDraftCard(campaign, false, false);
    const { campaignCategories } = useGeneralStore();
    const { milestoneStatus } = useGeneralStore();




    useEffect(() => {
        const timer = setInterval(() => {
            if (campaign.deadline) {
                setTimeRemaining(getTimeRemaining(campaign.deadline));
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [campaign.deadline]);



    const categoryName = campaignCategories.find((category) => category.id === Number(campaign.campaing_category_id))?.name;

    return (
        <div className={styles.campaignCard}>
            <div className={styles.headCard}>
                <Image width={58} height={58} src={campaign.logo_url ?? ''} alt="logo-company" className={styles.logoCard} />
                <div className={styles.cardDetails}>
                    <div className={styles.status}>
                        <div className={`${styles.state} ${styles[labelClass]}`}>{campaign.campaign_status_id === '8' ? formatAllTime(timeRemaining) : label}</div>
                        <div className={styles.category}>{categoryName}</div>
                    </div>
                    <div className={styles.investors}>
                        <svg width="12" height="12" className={styles.icon}>
                            <use href={TWO_USERS}></use>
                        </svg>
                        <p className={styles.cant}>{campaign.investors}</p>
                    </div>
                </div>
            </div>
            <h3 className={styles.cardTitle}>{campaign.name}</h3>
            <p className={styles.cardDescription}>{campaign.description}</p>
            <CardFooter campaign={campaign} />
        </div>
    );
}
