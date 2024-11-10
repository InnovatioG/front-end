import React from 'react';
import styles from "./SocialButton.module.scss";

interface SocialButtonProps {
    icon: string;
}

const SocialButton: React.FC<SocialButtonProps> = ({ icon }) => {
    return (
        <div className={styles['icon-container']}>
            <svg width="20" height="20" className={styles.icon}>
                <use href={icon}></use>
            </svg>
        </div>
    );
}

export default SocialButton;