import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/defaultAvatar/DefaultAvatar';
import styles from "./CampaignHeader.module.scss"
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';

interface CampaignHeaderProps {
    /*     title: string;
        banner_image: string;
        company_logo: string; */

}

const CampaignHeader: React.FC<CampaignHeaderProps> = () => {


    const { project } = useProjectDetailStore();



    return (
        <div className={styles.headerCampaignContainer}>
            <Avatar big={true}>
                <AvatarImage src={project.company_logo} alt={project.title} />
                <AvatarFallback>{project.title[0]}</AvatarFallback>
            </Avatar>
            <h2 className={styles.title}>{project.title}</h2>
        </div>
    );
}

export default CampaignHeader;