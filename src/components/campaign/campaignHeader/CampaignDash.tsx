import React from 'react';
import Image from 'next/image';
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
import CampaignCard from '../creator/finalSetup/CampaignCard';
import SocialMediaCardContainer from '../creator/finalSetup/SocialMediaCard';
interface CampaignDashCreationProps {
    styles: any;
}

const CampaignDashCreation: React.FC<CampaignDashCreationProps> = ({ styles }) => {
    const { project } = useProjectDetailStore();
    return (
        <article className={styles.dashboardCampaignContainer}>
            <div className={styles.imagenContainer}>
                <Image src={"/img/ui/cohete.webp"} alt="cohete" layout='fill' objectFit='cover' />
            </div>
            <div className={styles.imageBannerContainer}>
                <Image src={project.banner_image} alt="Banner" layout="fill" objectFit="cover" />
            </div>
            <div className={styles.cardContainer}>
                <CampaignCard status={project.status} goal={project.goal} min_request={project.min_request} investors={project.investors} />
                <SocialMediaCardContainer />
            </div>
        </article>);
}

export default CampaignDashCreation;