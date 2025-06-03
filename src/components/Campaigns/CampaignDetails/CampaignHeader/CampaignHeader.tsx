import Avatar from '@/components/GeneralOK/Avatar/Avatar';
import BannerCampaign from '@/components/GeneralOK/BannerCampaign/BannerCampaign';
import { ICampaignDetails } from '@/hooks/useCampaingDetails';
import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import { PageViewEnums } from '@/utils/constants/routes';
import Image from 'next/image';
import React from 'react';
import styles from './CampaignHeader.module.scss';
import CampaignHeaderInfo from './CampaignHeaderInfo/CampaignHeaderInfo';
import CampaignSocialLinksAndActions from './CampaignSocialLinksAndActions/CampaignSocialLinksAndActions';
import useCampaignHeader from './useCampaignHeader';

const CampaignHeader: React.FC<ICampaignIdStoreSafe & ICampaignDetails> = (props: ICampaignIdStoreSafe & ICampaignDetails) => {
    const { campaign, isProtocolTeam, isEditMode, isAdmin, isEditor, pageView, campaignTab } = props;
    const { handleChangeAvatar, handleChangeBanner } = useCampaignHeader(props);

    const isEditing = props.pageView === PageViewEnums.MANAGE && props.isEditMode === true;

    return (
        <>
            <div className={styles.headerCampaignContainer}>
                <Avatar name={campaign.campaign.name} picture={campaign.campaign.logo_url || ''} setPicture={(picture) => handleChangeAvatar(picture)} isEditing={isEditing} />
                <h2 className={styles.title}>{campaign.campaign.name}</h2>
                {pageView === PageViewEnums.MANAGE && isEditMode === false && (
                    <p>
                        {isProtocolTeam === true
                            ? `PROTOCOL TEAM - MANAGE CAMPAIGN`
                            : isAdmin === true
                            ? `ADMIN - MANAGE CAMPAIGN`
                            : isEditor === true
                            ? `EDITOR - MANAGE CAMPAIGN`
                            : null}
                    </p>
                )}
                {pageView === PageViewEnums.MANAGE && isEditMode === true && (
                    <p>
                        {isProtocolTeam === true
                            ? `PROTOCOL TEAM - EDIT CAMPAIGN`
                            : isAdmin === true
                            ? `ADMIN - EDIT CAMPAIGN`
                            : isEditor === true
                            ? `EDITOR - EDIT CAMPAIGN`
                            : null}
                    </p>
                )}
            </div>
            <article className={styles.dashboardCampaignContainer}>
                <div className={styles.imagenContainer}>
                    <Image src={'/img/ui/cohete.webp'} alt="cohete" layout="fill" objectFit="cover" />
                </div>

                <BannerCampaign picture={campaign.campaign.banner_url || ''} setPicture={(picture) => handleChangeBanner(picture)} isEditing={isEditing} />

                <div className={styles.cardContainer}>
                    <CampaignHeaderInfo {...props} />
                    <CampaignSocialLinksAndActions {...props} />
                </div>
            </article>
        </>
    );
};

export default CampaignHeader;
