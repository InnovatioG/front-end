import React, { useState } from 'react';
import Image from 'next/image';
import styles from './Avatar.module.scss';
import { useCampaignStore } from '@/store/campaign/useCampaignStore';
import UploadFile from '@/components/ui/buttons/uploadFile/UploadFile';
import { Interface } from 'readline';


export interface AvatarProps {
    setPicture: (value: string) => void;
    picture: string;
}



const Avatar = ({
    setPicture, picture
}: AvatarProps) => {
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
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="fileInput"
            />
            <div className={styles.containerIcon}>
                {!picture ? (
                    <UploadFile styleType='black' />
                ) : (
                    <div className={styles.avatarContainer}>
                        <Image src={picture} alt="Avatar" layout="fill"
                            objectFit="cover" className={styles.picturePreview} />
                    </div>
                )}
            </div>
        </section>
    );
};

export default Avatar;