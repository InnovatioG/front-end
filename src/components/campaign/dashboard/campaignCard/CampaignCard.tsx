import styles from "./CampaignCard.module.scss";
import Image from "next/image";
import { Campaign } from "@/HardCode/databaseType";
import { TWO_USERS } from "@/utils/images";
import CampaignRaised from "./CampaignRaised";
import { useEffect, useState } from "react";
import { formatTime, getTimeRemaining } from "@/utils/formats";

interface CampaignCardProps {
  campaign: Campaign;
  getStatusName: (statusId: number) => string;
  getCategoryName: (categoryId: number) => string;
}


export default function CampaignCard(props: CampaignCardProps) {
  const { campaign, getStatusName, getCategoryName } = props;
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining(campaign.end_date));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(getTimeRemaining(campaign.end_date));
    }, 1000);

    return () => clearInterval(timer);
  }, [campaign.end_date]);


  const renderStatus = () => {
    if (timeRemaining.total <= 0) {
      return getStatusName(campaign.state_id);
    }

    if (timeRemaining.total <= 72 * 60 * 60 * 1000) {
      return `${formatTime(timeRemaining.totalHours)}:${formatTime(timeRemaining.minutes)}:${formatTime(timeRemaining.seconds)}`;
    }

    return getStatusName(campaign.state_id);
  };

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
          <div className={styles.status}>
            <div
              className={`${styles.state} ${
                styles[getStatusName(campaign.state_id).toLowerCase()]
              }`}
            >
              {renderStatus()}
            </div>
            <div className={styles.category}>
              {getCategoryName(campaign.category_id)}
            </div>
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
      <CampaignRaised campaign={campaign} getStatusName={getStatusName}/>
    </div>
  );
}
