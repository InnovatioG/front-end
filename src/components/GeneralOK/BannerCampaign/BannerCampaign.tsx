import Image from 'next/image';
import React, { useRef } from 'react';
import styles from './BannerCampaign.module.scss';
import { isNullOrBlank } from 'smart-db';
import { isBlobURL } from '@/utils/utils';
import DropArchiveUpload from '@/components/General/DropArchiveUpload/DropArchiveUpload';

interface BannerCampaignProps {
    picture: string;
    setPicture: (value: string) => void;
    isEditing: boolean;
}

const BannerCampaign = ({ picture, setPicture, isEditing }: BannerCampaignProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.stopPropagation();
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
                URL.revokeObjectURL(picture);
            }

            setPicture(URL.createObjectURL(fileToUpload));
        }
    };

    const handleUploadClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        fileInputRef.current?.click();
    };

    return (
        <div className={styles.imageBannerContainer}>
            <input type="file" accept="image/*" onChange={handleFileChange} hidden ref={fileInputRef} id="fileInput" />

            {isEditing === false ? (
                <Image src={isNullOrBlank(picture) ? '/img/ui/campaign_generic_banner.jpg' : picture} alt="Banner" layout="fill" objectFit="cover" className={styles.bannerImage} />
            ) : (
                <>
                    <DropArchiveUpload
                        file={picture}
                        setFile={setPicture}
                        className={styles.bannerImage}
                        placeholder={null}
                        aspectRatioHint="1024x576 pixels"
                        fileInputRef={fileInputRef}
                    />
                </>
            )}
        </div>
    );
};

export default BannerCampaign;
