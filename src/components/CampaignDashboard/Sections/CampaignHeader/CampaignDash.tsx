import { Avatar, AvatarFallback, AvatarImage } from '@/components/General/Elements/DefaultAvatar/DefaultAvatar';
import useDraftCard from '@/hooks/useDraftCard';
import styles from '@/pages/campaign/[id]/campainPagelayout.module.scss';
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
import { CardInformationByState } from '@/utils/constants';
import Image from 'next/image';
import React, { useRef } from 'react';
import CampaignCard from '../../../CampaignCreation/Elements/CampaignCard';
import SocialMediaCardContainer from '../../../CampaignCreation/Elements/SocialMediaCard';
/*  */
interface CampaignDashCreationProps {}

const CampaignDashCreation: React.FC<CampaignDashCreationProps> = ({}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { project, editionMode, setProject, isProtocolTeam, isAdmin } = useProjectDetailStore();

    const campaign = {
        ...project,
        campaign_type: 'Target' as const, // Garantiza el valor correcto
    };

    const { label } = useDraftCard(campaign, isProtocolTeam, isAdmin);

    const state = CardInformationByState(project.state_id);
    /*     const label = state.label.toLowerCase().replace(/\s+/g, '-');
     */

    const handleChangePicture = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setProject({ ...project, banner_url: reader.result as string });
        };
        reader.readAsDataURL(file);
    };

    const handleButtonClickFile = () => {
        fileInputRef.current?.click();
    };

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
                <Image src={project.banner_url} alt="Banner" layout="fill" objectFit="cover" />
            </div>
            <div className={styles.avatarContainer}>
                <Avatar big={true} className={styles.pictureContainer}>
                    <AvatarImage src={project.logo_url} alt={project.title} />
                    <AvatarFallback>{project.title[0]}</AvatarFallback>
                </Avatar>
            </div>
            <div className={styles.cardContainer}>
                <CampaignCard status={label} goal={project.goal} min_request={project.min_request} investors={project.investors} startDate={project.start_date} />
                <SocialMediaCardContainer />
            </div>
        </article>
    );
};

export default CampaignDashCreation;
