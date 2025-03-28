import { Avatar, AvatarFallback, AvatarImage } from '@/components/General/Elements/DefaultAvatar/DefaultAvatar';
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
import React from 'react';
import styles from './CampaignHeader.module.scss';

interface CampaignHeaderProps {}

const CampaignHeader: React.FC<CampaignHeaderProps> = () => {
    const { project } = useProjectDetailStore();

    return (
        <div className={styles.headerCampaignContainer}>
            <Avatar big={true} className={styles.pictureContainer}>
                <AvatarImage src={project.logo_url} alt={project.title} />
                <AvatarFallback>{project.title[0]}</AvatarFallback>
            </Avatar>
            <h2 className={styles.title}>{project.title}</h2>
        </div>
    );
};

export default CampaignHeader;
