import Image from 'next/image';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import styles from './DropArchiveUpload.module.scss';
import { isBlobURL } from '@/utils/utils';
import { isNullOrBlank } from 'smart-db';

interface DropArchivUploadProps {
    file: string | undefined;
    setFile: (file: string) => void;
    className?: string; // Custom styles for different cases
    placeholder?: React.ReactNode; // Component when no image is set
    acceptedFormats?: string[];
    maxSizeMB?: number;
    aspectRatioHint?: string; // Example: "1024x576 pixels"
    fileInputRef: React.RefObject<HTMLInputElement>; // Parent passes the file input ref
}

const DropArchiveUpload: React.FC<DropArchivUploadProps> = ({
    file,
    setFile,
    className = '',
    placeholder = null,
    acceptedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/tiff', 'image/bmp'],
    maxSizeMB = 5,
    aspectRatioHint = '1024x576 pixels',
    fileInputRef,
}) => {
    const [isDragActive, setIsDragActive] = useState(false);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles.length > 0) {
                const fileToUpload = acceptedFiles[0];

                if (!acceptedFormats.includes(fileToUpload.type)) {
                    alert('Invalid file format.');
                    setIsDragActive(false);
                    return;
                }

                if (fileToUpload.size > maxSizeMB * 1024 * 1024) {
                    alert(`File is too large. Max size is ${maxSizeMB}MB.`);
                    setIsDragActive(false);
                    return;
                }

                if (!isNullOrBlank(file) && isBlobURL(file)) {
                    URL.revokeObjectURL(file!);
                }

                const previewUrl = URL.createObjectURL(fileToUpload);
                setFile(previewUrl);
            }
        },
        [setFile, acceptedFormats, maxSizeMB]
    );

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        onDragEnter: () => setIsDragActive(true),
        onDragLeave: () => setIsDragActive(false),
        noClick: true,
    });

    const handleUploadClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        fileInputRef.current?.click();
    };

    return (
        <div {...getRootProps()} className={`${styles.container} ${className}`}>
            {file ? (
                <div className={styles.previewContainer}>
                    <Image src={file} alt="Uploaded file" layout="fill" objectFit="cover" className={styles.imagePreview} />
                </div>
            ) : (
                <div className={styles.emptyState} onClick={handleUploadClick}>
                    {placeholder}
                    <p className={styles.dropText}>{isDragActive ? 'Drop the file here...' : `Click or Drop a file (${aspectRatioHint}).`}</p>
                </div>
            )}
            <div className={styles.plusContainer} onClick={handleUploadClick}>
                <Image src="/img/icons/plus.svg" width={30} height={30} alt="plus-icon" />
            </div>
        </div>
    );
};

export default DropArchiveUpload;
