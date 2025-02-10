import UploadFile from '@/components/General/Buttons/UploadFile/UploadFile';
import { uploadFileToS3 } from '@/utils/s3Upload';
import Image from 'next/image';
import React, { useRef } from 'react';
import styles from './Avatar.module.scss';

export interface AvatarProps {
    setPicture: (value: string) => void;
    picture: string;
}

const Avatar = ({ setPicture, picture }: AvatarProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const bucketName = 'innovatio.space/innovatioFounderMVP';
                const key = `avatar/${file.name}`;
                const fileUrl = await uploadFileToS3(file, bucketName, key);
                setPicture(fileUrl);
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }
    };

    const handleContainerClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <section className={styles.generalContainer} onClick={handleContainerClick}>
            <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} ref={fileInputRef} id="fileInput" />
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
