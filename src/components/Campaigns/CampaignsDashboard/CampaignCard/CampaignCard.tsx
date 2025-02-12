import { Avatar, AvatarFallback, AvatarImage } from '@/components/General/DefaultAvatar/DefaultAvatar';
import { BtnCampaignActions } from '@/components/GeneralOK/Buttons/Buttons/BtnCampaignActions/BtnCampaignActions';
import { useModal } from '@/contexts/ModalContext';
import { useCampaignDetails } from '@/hooks/useCampaingDetails';
import type { CampaignEX } from '@/types/types';
import { CampaignViewForEnums } from '@/utils/constants/constants';
import { TWO_USERS } from '@/utils/constants/images';
import { CampaignStatus_Code_Id_Enums } from '@/utils/constants/status';
import { ButtonType } from '@/utils/constants/stylesAndButtonsByStatusCodeId';
import { useRouter } from 'next/router';
import styles from './CampaignCard.module.scss';
import CampaingCardInfo from './CampaingCardInfo/CampaingCardInfo';

interface CampaignCardProps {
    campaign: CampaignEX;
    campaignViewFor: CampaignViewForEnums;
}

export default function CampaignCard(props: CampaignCardProps) {
    const { campaign } = props;

    const propsCampaignDetails = useCampaignDetails({ isEditMode: false, ...props });
    const { openModal } = useModal();
    const router = useRouter();

    const {
        isProtocolTeam,
        isAdmin,
        isEditor,
        campaignViewFor,
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
    } = propsCampaignDetails;

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
            <h3 className={styles.cardTitle}>{campaign.campaign.name}</h3>
            <p className={styles.cardDescription}>{campaign.campaign.description}</p>
            {`DEBUG - isAdmin: ${isAdmin} - isEditor: ${isEditor}`}
            <CampaingCardInfo campaign={campaign} {...propsCampaignDetails} />
            <div className={styles.cardButtons}>
                {buttonsForCards.map((button: ButtonType, index: number) => (
                    <BtnCampaignActions key={index} button={button} data={{ id: campaign.campaign._DB_id }} navigate={router.push} openModal={openModal} handles={undefined} />
                ))}
            </div>
        </div>
    );
}
