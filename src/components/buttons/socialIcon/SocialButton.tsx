import React from 'react';
import styles from "./SocialButton.module.scss";

interface SocialButtonProps {
    icon: string;
    name?: "website" | "facebook" | "instagram" | "discord" | "linkedin" | "xs";
    setSocialLink?: React.Dispatch<React.SetStateAction<"website" | "facebook" | "instagram" | "discord" | "linkedin" | "xs">>;
}

const SocialButton: React.FC<SocialButtonProps> = ({ icon, name, setSocialLink }) => {

    return (
        <div className={styles['icon-container']} onClick={() => name && setSocialLink && setSocialLink(name)}>
            <svg width="20" height="20" className={styles.icon}>
                <use href={icon}></use>
            </svg>
        </div>
    );
}

export default SocialButton;