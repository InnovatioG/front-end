import UploadFile from '@/components/General/Buttons/UploadFile/UploadFile';
import { uploadFileToS3 } from '@/utils/s3Upload';
import Image from 'next/image';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import styles from './DropArchive.module.scss';

interface DropArchiveProps {
    file: string | null;
    setFile: (file: string) => void;
}

const DropArchive: React.FC<DropArchiveProps> = ({ file, setFile }) => {
    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            if (file) {
                try {
                    const bucketName = 'innovatio.space/innovatioFounderMVP';
                    const key = `avatar/${file.name}`;
                    const fileUrl = await uploadFileToS3(file, bucketName, key);
                    setFile(fileUrl);
                } catch (error) {
                    console.error('Error uploading file:', error);
                }
            }
        },
        [setFile]
    );

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        noClick: true,
    });

    const handleContainerClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        open();
    };

    return (
        <article {...getRootProps()} className={styles.container} onClick={(e) => e.stopPropagation()}>
            <input {...getInputProps()} />

            <div className={styles.uploadArchiveContainer} onClick={handleContainerClick}>
                {file ? (
                    <div className={styles.avatarContainer}>
                        <Image src={file} alt="Banner" layout="fill" objectFit="cover" className={styles.picturePreview} />
                    </div>
                ) : (
                    <UploadFile styleType="gray" />
                )}
                {isDragActive ? <p>Drop the files here ...</p> : <p>The image should be 1024x576 pixels. It must be a JPG, PNG, GIF, TIFF or BMP file, no larger than 5 MB.</p>}
            </div>
        </article>
    );
};

export default DropArchive;
