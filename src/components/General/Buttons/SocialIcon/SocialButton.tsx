import React from 'react';
import styles from './SocialButton.module.scss';
import { SocialLinksEnums } from '@/utils/constants/constants';

interface SocialButtonProps {
    icon: string;
    name?: SocialLinksEnums;
    setSocialLink?: React.Dispatch<React.SetStateAction<SocialLinksEnums>>;
}

const SocialButton: React.FC<SocialButtonProps> = ({ icon, name, setSocialLink }) => {
    return (
        <div className={styles['icon-container']} onClick={() => name && setSocialLink && setSocialLink(name)}>
            <svg width="20" height="20" className={styles.icon}>
                <use href={icon}></use>
            </svg>
        </div>
    );
};

export default SocialButton;
