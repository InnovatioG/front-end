import { Avatar, AvatarFallback, AvatarImage } from '@/components/General/DefaultAvatar/DefaultAvatar';
import { ICampaignDetails } from '@/hooks/useCampaingDetails';
import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import Image from 'next/image';
import React from 'react';
import styles from './CampaignHeader.module.scss';
import CampaignHeaderInfo from './CampaignHeaderInfo/CampaignHeaderInfo';
import CampaignHeaderSocialAndButton from './CampaignHeaderSocialAndButton/CampaignHeaderSocialAndButton';
import useCampaignHeader from './useCampaignHeader';
import { isNullOrBlank } from 'smart-db';

const CampaignHeader: React.FC<ICampaignIdStoreSafe & ICampaignDetails> = (props: ICampaignIdStoreSafe & ICampaignDetails) => {
    const { campaign, editionMode } = props;
    const { handleChangePicture, handleButtonClickFile, fileInputRef } = useCampaignHeader(props);

    return (
        <>
            <div className={styles.headerCampaignContainer}>
                <Avatar big={true} className={styles.pictureContainer}>
                    <AvatarImage src={campaign.campaign.logo_url} alt={campaign.campaign.name} />
                    <AvatarFallback>{campaign.campaign.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <h2 className={styles.title}>{campaign.campaign.name}</h2>
                <p className={styles.description}>{campaign.campaign.description}</p>
            </div>
            <article className={styles.dashboardCampaignContainer}>
                <div className={styles.imagenContainer}>
                    <Image src={'/img/ui/cohete.webp'} alt="cohete" layout="fill" objectFit="cover" />
                </div>

                <div className={styles.imageBannerContainer}>
                    {editionMode === true && (
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

                    <Image src={isNullOrBlank(campaign.campaign.banner_url) ? '/img/ui/campaign_generic_banner.jpg' : campaign.campaign.banner_url!} alt="Banner" layout="fill" objectFit="cover" />
                </div>

                <div className={styles.cardContainer}>
                    <CampaignHeaderInfo {...props} />
                    <CampaignHeaderSocialAndButton {...props} />
                </div>
            </article>
        </>
    );
};

export default CampaignHeader;
