import React, { useState } from 'react';
import Image from 'next/image';
import styles from './Avatar.module.scss';
import { useCampaignStore } from '@/store/campaign/useCampaignStore';
import UploadFile from '@/components/buttons/uploadFile/UploadFile';

const Avatar = () => {
    const { setCompanyLogo, newCampaign } = useCampaignStore();


    /* TODO SUBIR LA IMAGEN EN NUESTRA BASE DE DATOS */

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCompanyLogo(reader.result as string);
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
                {!newCampaign.company_logo ? (
                    <UploadFile styleType='black' />
                ) : (
                    <div className={styles.avatarContainer}>
                        <Image src={newCampaign.company_logo} alt="Avatar" layout="fill"
                            objectFit="cover" className={styles.picturePreview} />
                    </div>
                )}
            </div>
        </section>
    );
};

export default Avatar;