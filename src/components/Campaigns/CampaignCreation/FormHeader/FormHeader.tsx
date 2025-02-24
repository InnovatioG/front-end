import BtnConnectWallet from '@/components/GeneralOK/Buttons/Buttons/BtnConnectWallet/BtnConnectWallet';
import styles from './FormHeader.module.scss';
import { LOGO_FULL_DARK } from '@/utils/constants/images';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { ROUTES } from '@/utils/constants/routes';

interface FormHeaderProps {}

const FormHeader: React.FC<FormHeaderProps> = ({}) => {
    return (
        <div className={styles.header}>
            <Link href={ROUTES.home}>
                <a>
                    <Image height={18} width={108} src={LOGO_FULL_DARK} alt="logo-full" className={styles.logo} priority />
                </a>
            </Link>
            <div className={styles.containerPrimary}>
                <BtnConnectWallet type="primary" width={166} />
            </div>
        </div>
    );
};

export default FormHeader;
