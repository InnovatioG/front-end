import UploadFile from '@/components/UI/Buttons/UploadFile/UploadFile';
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
        (acceptedFiles: File[]) => {
            //! TODO SUBIR LA IMAGEN EN NUESTRA BASE DE DATOS
            const reader = new FileReader();
            reader.onloadend = () => {
                setFile(reader.result as string);
            };
            reader.readAsDataURL(acceptedFiles[0]);
        },
        [setFile]
    );

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        noClick: true,
    });

    return (
        <article {...getRootProps()} className={styles.container} onClick={(e) => e.stopPropagation()}>
            <input {...getInputProps()} />

            <div className={styles.uploadArchiveContainer} onClick={open}>
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
