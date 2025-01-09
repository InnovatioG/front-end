import Image from 'next/image';
import React from 'react';
import styles from './GeneralError.module.scss';

interface GeneralErrorProps {
    message: string;
    icon?: string;
}

const GeneralError: React.FC<GeneralErrorProps> = ({ message, icon }) => {
    return (
        <div className={styles.layout}>
            <div className={styles.errorIcon}>
                <Image src="/img/icons/error.svg" alt="Error" width={90} height={90} />
            </div>
            <div>
                <span className={styles.message}>{message}</span>
            </div>
        </div>
    );
};

export default GeneralError;
