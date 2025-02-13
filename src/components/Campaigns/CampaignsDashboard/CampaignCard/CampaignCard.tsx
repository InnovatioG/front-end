import { Avatar, AvatarFallback, AvatarImage } from '@/components/General/DefaultAvatar/DefaultAvatar';
import { BtnCampaignActions } from '@/components/GeneralOK/Buttons/Buttons/BtnCampaignActions/BtnCampaignActions';
import { useCampaignDetails } from '@/hooks/useCampaingDetails';
import { useGeneralStore } from '@/store/generalStore/useGeneralStore';
import type { CampaignEX } from '@/types/types';
import { ButtonType } from '@/utils/constants/buttons';
import { TWO_USERS } from '@/utils/constants/images';
import { CampaignTabEnum, PageViewEnums, ROUTES } from '@/utils/constants/routes';
import { CampaignStatus_Code_Id_Enums } from '@/utils/constants/status/status';
import { formatAllTime } from '@/utils/formats';
import Link from 'next/link';
import styles from './CampaignCard.module.scss';
import CampaingCardInfo from './CampaingCardInfo/CampaingCardInfo';

interface CampaignCardProps {
    campaign: CampaignEX;
    pageView: PageViewEnums;
    fetchCampaignsEX: () => Promise<void>;
}

export default function CampaignCard(props: CampaignCardProps) {
    const { showDebug } = useGeneralStore();

    const { campaign } = props;

    const propsCampaignDetails = useCampaignDetails({ isEditMode: false, ...props });

    const {
        isProtocolTeam,
        isAdmin,
        isEditor,
        pageView,
        campaign_category_name,
        campaign_status_code_id,
        label,
        labelClass,
        buttonsForCards,
        timeRemainingBeginAt,
        timeRemainingDeadline,
        currentMilestoneIndex,
        currentMilestoneString,
        currentMilestoneStringOrdinal,
        totalMilestones,
        fundedPercentage,
        handles,
    } = propsCampaignDetails;

    return (
        <div className={styles.campaignCard}>
            <div className={styles.headCard}>
                <Link href={`${ROUTES.campaignViewTab(campaign.campaign._DB_id, CampaignTabEnum.DETAILS)}`}>
                    <Avatar big={false} className={styles.pictureContainer}>
                        <AvatarImage src={campaign.campaign.logo_url} alt={campaign.campaign.name} />
                        <AvatarFallback>{campaign.campaign.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                </Link>
                <div className={styles.cardDetails}>
                    <div className={styles.statusContainer}>
                        <div className={`${styles.status} ${styles[labelClass]}`}>
                            {campaign_status_code_id === CampaignStatus_Code_Id_Enums.COUNTDOWN ? formatAllTime(timeRemainingBeginAt) : label}
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
            <Link href={`${ROUTES.campaignViewTab(campaign.campaign._DB_id, CampaignTabEnum.DETAILS)}`}>
                <h3 className={styles.cardTitle}>{campaign.campaign.name}</h3>
            </Link>
            <p className={styles.cardDescription}>{campaign.campaign.description}</p>
            {showDebug && `DEBUG - isAdmin: ${isAdmin} - isEditor: ${isEditor}`}
            <CampaingCardInfo campaign={campaign} {...propsCampaignDetails} />
            <div className={styles.cardButtons}>
                {buttonsForCards.map((button: ButtonType, index: number) => (
                    <BtnCampaignActions key={index} button={button} data={{ id: campaign.campaign._DB_id }} handles={handles} />
                ))}
            </div>
        </div>
    );
}
