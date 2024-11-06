import React from 'react';
import styles from "./UploadFile.module.scss"
import Image from 'next/image';
interface UploadFileProps {
    styleType: "black" | "gray";

}

const UploadFile: React.FC<UploadFileProps> = ({ styleType }) => {
    return (
        <div className={styleType == "black" ? styles.generalContainer : styles.generalContainerGray}>
            <div className={styles.containerIcon}>
                <label htmlFor="fileInput" >
                    <Image src="/img/icons/camera.svg" width={30} height={30} alt="camera-icon" />
                </label>
                <div className={styles.plusContainer}>
                    {
                        styleType == "black" ?
                            <Image src="/img/icons/+.svg" width={15} height={15} alt="plus-icon" /> :
                            <Image src="/img/icons/plusGray.svg" width={15} height={15} alt="plus-icon" />
                    }
                </div>
            </div>
        </div>);
}

export default UploadFile;