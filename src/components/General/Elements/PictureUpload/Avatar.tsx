import UploadFile from '@/components/UI/Buttons/UploadFile/UploadFile';
import Image from 'next/image';
import React from 'react';
import styles from './Avatar.module.scss';

export interface AvatarProps {
    setPicture: (value: string) => void;
    picture: string;
}

const Avatar = ({ setPicture, picture }: AvatarProps) => {
    /*     const { setCompanyLogo, newCampaign } = useCampaignStore();
     */

    /* TODO SUBIR LA IMAGEN EN NUESTRA BASE DE DATOS */

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPicture(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <section className={styles.generalContainer}>
            <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} id="fileInput" />
            <div className={styles.containerIcon}>
                {!picture ? (
                    <UploadFile styleType="black" />
                ) : (
                    <div className={styles.avatarContainer}>
                        <Image src={picture} alt="Avatar" layout="fill" objectFit="cover" className={styles.picturePreview} />
                    </div>
                )}
            </div>
        </section>
    );
};

export default Avatar;
