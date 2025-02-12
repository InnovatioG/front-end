import { Avatar, AvatarFallback, AvatarImage } from '@/components/General/DefaultAvatar/DefaultAvatar';
import { ICampaignDetails } from '@/hooks/useCampaingDetails';
import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import Image from 'next/image';
import React, { useEffect } from 'react';
import styles from './CampaignHeader.module.scss';
import CampaignHeaderInfo from './CampaignHeaderInfo/CampaignHeaderInfo';
import CampaignSocialLinksAndActions from './CampaignSocialLinksAndActions/CampaignSocialLinksAndActions';
import useCampaignHeader from './useCampaignHeader';
import { isNullOrBlank } from 'smart-db';
import Link from 'next/link';
import { ROUTES } from '@/utils/constants/routes';
import { CampaignViewForEnums } from '@/utils/constants/constants';

const CampaignHeader: React.FC<ICampaignIdStoreSafe & ICampaignDetails> = (props: ICampaignIdStoreSafe & ICampaignDetails) => {
    const { campaign, isEditMode, isProtocolTeam, isAdmin, isEditor, campaignViewFor, campaignTab } = props;
    const { handleChangePicture, handleButtonClickFile, fileInputRef } = useCampaignHeader(props);

    return (
        <>
            <div className={styles.headerCampaignContainer}>
                <Avatar big={true} className={styles.pictureContainer}>
                    <AvatarImage src={campaign.campaign.logo_url} alt={campaign.campaign.name} />
                    <AvatarFallback>{campaign.campaign.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <h2 className={styles.title}>{campaign.campaign.name}</h2>
                {/* {(campaignViewFor === CampaignViewForEnums.home || campaignViewFor === CampaignViewForEnums.campaigns) &&
                    (isProtocolTeam === true || isAdmin === true || isEditor === true) && (
                        <p>
                            <Link href={ROUTES.campaignManage(campaign.campaign._DB_id, campaignTab)}>Manage</Link>
                        </p>
                    )}
                {campaignViewFor === CampaignViewForEnums.manage && (isProtocolTeam === true || isAdmin === true || isEditor === true) && isEditMode === false && (
                    <p>
                        <Link href={ROUTES.campaignEdit(campaign.campaign._DB_id, campaignTab)}>Edit</Link>
                    </p>
                )} */}

                {campaignViewFor === CampaignViewForEnums.manage && isEditMode === false && (
                    <p>
                        {isProtocolTeam === true
                            ? `- PROTOCOL TEAM - MANAGE CAMPAIGN`
                            : isAdmin === true
                            ? `- ADMIN - MANAGE CAMPAIGN`
                            : isEditor === true
                            ? `- EDITOR - MANAGE CAMPAIGN`
                            : null}
                    </p>
                )}

                {campaignViewFor === CampaignViewForEnums.manage && isEditMode === true && (
                    <p>
                        {isProtocolTeam === true
                            ? `- PROTOCOL TEAM - EDIT CAMPAIGN`
                            : isAdmin === true
                            ? `- ADMIN - EDIT CAMPAIGN`
                            : isEditor === true
                            ? `- EDITOR - EDIT CAMPAIGN`
                            : null}
                    </p>
                )}
            </div>
            <article className={styles.dashboardCampaignContainer}>
                <div className={styles.imagenContainer}>
                    <Image src={'/img/ui/cohete.webp'} alt="cohete" layout="fill" objectFit="cover" />
                </div>

                <div className={styles.imageBannerContainer}>
                    {isEditMode === true && (
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

                    <Image
                        src={isNullOrBlank(campaign.campaign.banner_url) ? '/img/ui/campaign_generic_banner.jpg' : campaign.campaign.banner_url!}
                        alt="Banner"
                        layout="fill"
                        objectFit="cover"
                    />
                </div>

                <div className={styles.cardContainer}>
                    <CampaignHeaderInfo {...props} />
                    <CampaignSocialLinksAndActions {...props} />
                </div>
            </article>
        </>
    );
};

export default CampaignHeader;
