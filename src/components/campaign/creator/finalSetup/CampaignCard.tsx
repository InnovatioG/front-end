import React from 'react';
import styles from "./CampaignCard.module.scss"
import { TWO_USERS } from '@/utils/images';
import { calculatePorcentage, formatMoney } from '@/utils/formats';




interface CampaignCardProps {
    status: string;
    goal: number;
    min_request: number;
    investors: number;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ status, goal, min_request, investors }) => {


    const progressWidth = `${min_request}%`;

    console.log(status)

    return (
        <section className={styles.campaignCard}>
            <div className={styles.campaignCardStatus}>
                <div className={styles.statusContainer}>
                    <span className={styles.status}>
                        {status}
                    </span>
                </div>
                <div className={styles.investors}>
                    <svg width="12" height="12" className={styles.icon}>
                        <use href={TWO_USERS}></use>
                    </svg>
                    <span className={styles.span}>{investors}</span>
                </div>
            </div>
            <div className={styles.campaignCardGoal}>
                <p>Fundraise goal</p>
                <span className={styles.goal}>{formatMoney(goal)}</span>
            </div>

            {/* EL P CAMBIA ACORDE AL STATUS --- CHEQUEAR OPCIONES EN DOC */}
            <div className={styles.campaignCardMinRequest}>
                <div className={styles.medidor}>
                    <div className={styles.progress} style={{ width: progressWidth }}></div>

                </div>
                <p>Minimum collection to activate the campaign {min_request}%: {formatMoney(calculatePorcentage(goal, min_request))}</p>
            </div>
        </section>
    );
}

export default CampaignCard;