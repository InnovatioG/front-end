import React from 'react';
import styles from "./SocialButton.module.scss";
import type { IconType } from '@/utils/images';

interface SocialButtonProps {
    icon: IconType;
}

const SocialButton: React.FC<SocialButtonProps> = ({
    icon,
}) => {
    return (
        <div>
            <svg width="20" height="20" className={styles.icon}>
                <use href={icon}></use>
            </svg>
        </div>
    );
}

export default SocialButton;