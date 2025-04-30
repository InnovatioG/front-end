import Image from 'next/image';
import React from 'react';
import styles from './BtnUploadFile.module.scss';

interface BtnUploadFileProps {
    styleType: 'black' | 'gray';
    onClick: (event: React.MouseEvent) => void;
}

const BtnUploadFile: React.FC<BtnUploadFileProps> = ({ styleType, onClick }) => {
    return (
        <div className={styleType === 'black' ? styles.generalContainer : styles.generalContainerGray}>
            <div className={styles.containerIcon}>
                <Image
                    src="/img/icons/camera.svg"
                    width={30}
                    height={30}
                    alt="camera-icon"
                    onClick={(event: React.MouseEvent) => {
                        event.stopPropagation(); // Prevent double triggers
                        onClick(event);
                    }}
                />
            </div>
        </div>
    );
};

export default BtnUploadFile;
