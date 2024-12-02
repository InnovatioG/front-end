import { Campaign } from "@/HardCode/databaseType";
import styles from "./DraftCard.module.scss";
import Image from "next/image";
import { useEffect, useState } from "react";
import { formatTime, getTimeRemaining } from "@/utils/formats";
import { ROUTES } from "@/utils/routes";
import BtnDraftActions from "../../dashboard/campaignFilters/BtnDraftActions";

interface DraftCardProps {
  campaign: Campaign;
  getContractsName: (contractId: number) => string;
  getStatusName: (stateId: number) => string;
  getCategoryName: (categoryId: number) => string;
  adminView: boolean;
}

export type StatusContracts = "Active" | "TBL" | "Created" | "Signed" | "Ready" | "Deleted" | "Ended";
export type StatusName = "Created" | "Submitted" | "Rejected" | "Approved" | "Contract Created" | "Contract Published" | "Contract Started" | "Countdown" | "Fundraising" | "Finishing" | "Active" | "Failed" | "Unreached" | "Success";


export default function DraftCard(props: DraftCardProps) {
  const { campaign, getContractsName, getCategoryName, adminView, getStatusName } = props;
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining(campaign.end_date));




  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(getTimeRemaining(campaign.end_date));
    }, 1000);

    return () => clearInterval(timer);
  }, [campaign.end_date]);


  const renderStatus = () => {
    if (timeRemaining.total <= 0) {
      return getContractsName(campaign.contract_id);
    }

    if (timeRemaining.total <= 72 * 60 * 60 * 1000) {
      return `${formatTime(timeRemaining.totalHours)}:${formatTime(timeRemaining.minutes)}}`;
    }
    return `${getContractsName(campaign.contract_id)} ${getStatusName(campaign.state_id)}`;
  };


  return (
    <div className={`${styles.campaignCard} ${styles[getStatusName(campaign.contract_id).toLowerCase()]}`}>
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
            <div
              className={`${styles.state} ${styles[getStatusName(campaign.contract_id).toLowerCase()]
                }`}
            >
              {renderStatus()}
            </div>
            <div className={styles.category}>
              {getCategoryName(campaign.category_id)}
            </div>
          </div>
        </div>
      </div>
      <h3 className={styles.cardTitle}>{campaign.title}</h3>
      <p className={styles.cardDescription}>{campaign.description}</p>
      <div className={styles.actionsTarget}>
        <BtnDraftActions type={getContractsName(campaign.contract_id) as StatusContracts} url={ROUTES.home} url2={ROUTES.home} adminView={adminView} />
      </div>
    </div>
  );
}
