import BtnUploadFile from '@/components/GeneralOK/Buttons/Buttons/BtnUploadFile/BtnUploadFile';
import Image from 'next/image';
import React, { useRef } from 'react';
import styles from './AvatarUpload.module.scss';
import { isNullOrBlank } from 'smart-db';
import { isBlobURL } from '@/utils/utils';

export interface AvatarUploadProps {
    setPicture: (value: string) => void;
    picture: string;
}

const AvatarUpload = ({ setPicture, picture }: AvatarUploadProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.stopPropagation(); // Prevent double triggers
        const fileToUpload = event.target.files?.[0];

        if (fileToUpload) {
            const acceptedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/tiff', 'image/bmp'];
            const maxSizeMB = 5;

            if (!acceptedFormats.includes(fileToUpload.type)) {
                alert('Invalid file format.');
                return;
            }

            if (fileToUpload.size > maxSizeMB * 1024 * 1024) {
                alert(`File is too large. Max size is ${maxSizeMB}MB.`);
                return;
            }

            if (!isNullOrBlank(picture) && isBlobURL(picture)) {
                URL.revokeObjectURL(picture); // Revoke previous picture
            }

            setPicture(URL.createObjectURL(fileToUpload)); // Set picture
        }
    };

    const handleUploadClick = (event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent double triggers
        fileInputRef.current?.click();
    };

    return (
        <section className={styles.generalContainer}>
            <input type="file" accept="image/*" onChange={handleFileChange} hidden ref={fileInputRef} id="fileInput" />

            <div className={styles.avatarContainer}>
                {picture ? (
                    <Image src={picture} alt="Avatar" layout="fill" objectFit="cover" className={styles.picturePreview} />
                ) : (
                    <BtnUploadFile
                        styleType="black"
                        onClick={(event: React.MouseEvent) => {
                            handleUploadClick(event);
                        }}
                    />
                )}
            </div>

            <div
                className={styles.plusContainer}
                onClick={(event: React.MouseEvent) => {
                    handleUploadClick(event);
                }}
            >
                <Image src="/img/icons/plus.svg" width={15} height={15} alt="plus-icon" />
            </div>
        </section>
    );
};

export default AvatarUpload;
