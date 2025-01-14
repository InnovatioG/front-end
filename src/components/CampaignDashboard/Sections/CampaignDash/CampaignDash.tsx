import { Avatar, AvatarFallback, AvatarImage } from '@/components/General/Elements/DefaultAvatar/DefaultAvatar';
import useDraftCard from '@/hooks/useDraftCard';
import styles from '@/pages/campaign/[id]/campainPagelayout.module.scss';
import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';
import { CardInformationByState } from '@/utils/constants';
import Image from 'next/image';
import React, { useRef } from 'react';
import CampaignCard from '../../../CampaignCreation/Elements/CampaignCard/CampaignCard';
import SocialMediaCardContainer from '../../../CampaignCreation/Elements/SocialMediaCard/SocialMediaCard';
import { useGeneralStore } from '@/store/generalConstants/useGeneralConstants';
import useCampaignDash from "@/components/CampaignDashboard/Sections/CampaignDash/useCampaignDash"
/*  */
interface CampaignDashCreationProps { }

const CampaignDashCreation: React.FC<CampaignDashCreationProps> = ({ }) => {
    const {
        requestMaxAda,
        requestMinAda,
        investors,
        begin_at,
        cdFundedADA,
        label,
        handleChangePicture,
        handleButtonClickFile,
        fileInputRef,
        editionMode,
        campaign,
        setCampaign,
        getInternalId
    } = useCampaignDash();
    const state = CardInformationByState(Number(getInternalId(campaign.campaign_status_id)));


    return (
        <article className={styles.dashboardCampaignContainer}>
            <div className={styles.imagenContainer}>
                <Image src={'/img/ui/cohete.webp'} alt="cohete" layout="fill" objectFit="cover" />
            </div>

            <div className={styles.imageBannerContainer}>
                {editionMode && (
                    <div
                        className={styles.fileContainer}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'absolute',
                            bottom: 15,
                            right: 15,
                            zIndex: 1,
                            cursor: 'pointer',
                        }}
                    >
                        <input type="file" ref={fileInputRef} onChange={handleChangePicture} style={{ display: 'none' }} />
                        <button
                            onClick={handleButtonClickFile}
                            style={{
                                backgroundColor: 'rgba(125, 125, 125, 0.15)',
                                padding: '0.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: 30,
                                fontWeight: 100,
                                width: '3rem',
                                borderRadius: '0.4375rem',
                                height: '3rem',
                                border: '1px solid rgba(255, 255, 255, 0.5)',
                            }}
                        >
                            +
                        </button>
                    </div>
                )}
                <Image src={campaign.banner_url ? campaign.banner_url : ''} alt="Banner" layout="fill" objectFit="cover" />
            </div>
            <div className={styles.avatarContainer}>
                <Avatar big={true} className={styles.pictureContainer}>
                    <AvatarImage src={campaign.logo_url} alt={campaign.name} />
                    <AvatarFallback>{campaign.name[0]}</AvatarFallback>
                </Avatar>
            </div>
            <div className={styles.cardContainer}>
                <CampaignCard
                    status={label}
                    goal={Number(requestMaxAda)}
                    min_request={Number(requestMinAda)}
                    investors={investors}
                    startDate={begin_at}
                    cdFundedADA={cdFundedADA}
                />
                <SocialMediaCardContainer />
            </div>
        </article>
    );
};

export default CampaignDashCreation;
