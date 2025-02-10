import GeneralButtonUI from '@/components/General/Buttons/UI/Button';
import { useCampaignDetails } from '@/hooks/useCampaingDetails';
import type { CampaignEX } from '@/types/types';
import { TWO_USERS } from '@/utils/constants/images';
import { CampaignStatus_Code_Id } from '@/utils/constants/status';
import Image from 'next/image';
import Link from 'next/link';
import { isNullOrBlank } from 'smart-db';
import styles from './CampaignCard.module.scss';
import CampaingCardInfo from './CampaingCardInfo/CampaingCardInfo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/General/DefaultAvatar/DefaultAvatar';

interface CampaignCardProps {
    campaign: CampaignEX;
}

export default function CampaignCard(props: CampaignCardProps) {
    const { campaign } = props;

    const propsCampaignDetails = useCampaignDetails(campaign);

    const {
        campaign_category_name,
        campaign_status_code_id,
        label,
        labelClass,
        buttonsForCards,
        timeRemainingBeginAt,
        timeRemainingDeadline,
        formatAllTime,
        currentMilestoneIndex,
        currentMilestoneString,
        currentMilestoneStringOrdinal,
        totalMilestones,
        formatMoneyByADAOrDollar,
        fundedPercentage,
    } = propsCampaignDetails

    return (
        <div className={styles.campaignCard}>
            <div className={styles.headCard}>
                <Avatar big={false} className={styles.pictureContainer}>
                    <AvatarImage src={campaign.campaign.logo_url} alt={campaign.campaign.name} />
                    <AvatarFallback>{campaign.campaign.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
              
                <div className={styles.cardDetails}>
                    <div className={styles.statusContainer}>
                        <div className={`${styles.status} ${styles[labelClass]}`}>
                            {campaign_status_code_id === CampaignStatus_Code_Id.COUNTDOWN ? formatAllTime(timeRemainingBeginAt) : label}
                        </div>
                        <div className={styles.category}>{campaign_category_name}</div>
                    </div>
                    <div className={styles.investors}>
                        <svg width="12" height="12" className={styles.icon}>
                            <use href={TWO_USERS}></use>
                        </svg>
                        <p className={styles.cant}>{campaign.campaign.investors}</p>
                    </div>
                </div>
            </div>
            <h3 className={styles.cardTitle}>{campaign.campaign.name}</h3>
            <p className={styles.cardDescription}>{campaign.campaign.description}</p>
            <CampaingCardInfo
                campaign={campaign}
                {...propsCampaignDetails}
            />
            <div className={styles.cardButtons}>
                {buttonsForCards.map((button, index) => {
                    if (button.link) {
                        return (
                            <Link key={index} href={button.link(campaign.campaign._DB_id)}>
                                <GeneralButtonUI
                                    text={`${button.label} >`}
                                    onClick={() => null}
                                    // onClick={() => button.action && button.action((modalType) => openModal(modalType /* campaign._DB_id */))}
                                    classNameStyle={`${button.classNameType}`}
                                ></GeneralButtonUI>
                            </Link>
                        );
                    } else {
                        return (
                            <GeneralButtonUI
                                key={index}
                                text={`${button.label} >`}
                                onClick={() => null}
                                // onClick={() => button.action && button.action((modalType) => openModal(modalType /* campaign._DB_id, campaign */))}
                                classNameStyle={`${button.classNameType}`}
                            ></GeneralButtonUI>
                        );
                    }
                })}
            </div>
        </div>
    );
}
