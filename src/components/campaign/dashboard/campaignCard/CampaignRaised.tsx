import {
  Campaign,
  MilestoneCampaign,
  TargetCampaign,
} from "@/HardCode/databaseType";
import styles from "./CampaignRaised.module.scss";
import { formatMoney } from "@/utils/formats";
import BtnActions from "./BtnActions";

interface CampaignRaisedProps {
  campaign: Campaign;
  getStatusName: (statusId: number) => string;
}

interface MilestoneRaisedProps {
  campaign: MilestoneCampaign;
  getStatusName: (statusId: number) => string;
}

interface TargetRaisedProps {
  campaign: TargetCampaign;
  getStatusName: (statusId: number) => string;
}

function MilestoneRaised(props: MilestoneRaisedProps) {
  const { campaign, getStatusName } = props;

  const getCurrentMilestone = () => {
    let currentMilestone = 1;
    let totalRaised = campaign.raise_amount;

    for (const milestone of campaign.milestones) {
      if (totalRaised >= milestone.goal) {
        currentMilestone = milestone.order + 1;
        totalRaised -= milestone.goal;
      } else {
        break;
      }
    }

    return Math.min(currentMilestone, campaign.milestones.length);
  };

  const getOrdinal = (n: number): string => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const currentMilestone = getCurrentMilestone();

  return (
    <>
      <div className={styles.milestoneRaised}>
        <div
          className={`${styles.amount} ${
            styles[getStatusName(campaign.state_id).toLowerCase()]
          }`}
        >
          <p className={styles.value}>{formatMoney(campaign.raise_amount)}</p>
          <p className={styles.text}>Total Money Raised</p>
        </div>
        <div className={styles.milestone}>
          <p className={styles.value}>{getOrdinal(currentMilestone)}</p>
          <p className={styles.text}>Milestone</p>
        </div>
      </div>
      <div className={styles.actionsMilestone}>
        {getStatusName(campaign.state_id) === "Active" && (
          <BtnActions type={"secondary"} url={"/"} />
        )}
        <BtnActions type={"primary"} url={"/"} />
      </div>
    </>
  );
}

function TargetRaised(props: TargetRaisedProps) {
  const { campaign, getStatusName } = props;
  return (
    <>
      {getStatusName(campaign.state_id) === "Unreached" ? (
        <>
          <div className={styles.targetUnreached}>
            <div className={styles.details}>
              <p className={styles.raise}>
                Target Raise: {formatMoney(campaign.goal)}
              </p>
              <p className={styles.time}>
                Active campaign time:{" "}
                {(
                  (Date.parse(campaign.end_date) - Date.parse(campaign.start_date)) /
                  86400000
                ).toFixed(0)}{" "}
                days
              </p>
            </div>
            <div className={styles.targetInfo}>
              <div
                className={`${styles.amount} ${
                  styles[getStatusName(campaign.state_id).toLowerCase()]
                }`}
              >
                <p className={styles.value}>
                  {formatMoney(campaign.raise_amount)}
                </p>
                <p className={styles.text}>Total Money Raised</p>
              </div>
              <div className={styles.target}>
                <p className={styles.value}>
                  {(
                    (Number(campaign.raise_amount) / Number(campaign.goal)) *
                    100
                  ).toFixed(0)}
                  %
                </p>
                <p className={styles.text}>% Raised</p>
              </div>
            </div>
          </div>
        </>
      ) : getStatusName(campaign.state_id) === "Fundraising" ? (
        <>
          <div className={styles.targetFundraising}>
            <p className={styles.amount}>
              {formatMoney(campaign.raise_amount)}
            </p>
            <div className={styles.bar}>
              <div
                className={styles.complete}
                style={{
                  width: `${(
                    (Number(campaign.raise_amount) / Number(campaign.goal)) *
                    100
                  ).toFixed(0)}%`,
                }}
              ></div>
            </div>
            <p className={styles.raise}>
              Target Raise: {formatMoney(campaign.goal)}
            </p>
          </div>
        </>
      ) : getStatusName(campaign.state_id) === "Complete" ? (
        <>
          <div className={styles.targetComplete}>
            <p className={styles.amount}>
              {formatMoney(campaign.raise_amount)}
            </p>
            <p className={styles.raise}>Target Raise</p>
          </div>
        </>
      ) : null}

      <div className={styles.actionsTarget}>
        {getStatusName(campaign.state_id) === "Fundraising" && (
          <BtnActions type={"invest"} url={"/"} />
        )}
        <BtnActions type={"primary"} url={"/"} />
      </div>
    </>
  );
}

export default function CampaignRaised(props: CampaignRaisedProps) {
  const { campaign, getStatusName } = props;

  if (campaign.campaign_type === "Milestone") {
    return (
      <MilestoneRaised campaign={campaign} getStatusName={getStatusName} />
    );
  }

  return <TargetRaised campaign={campaign} getStatusName={getStatusName} />;
}
