import BtnConnectWallet from '@/components/UI/Buttons/ConnectWallet/BtnConnectWallet';
import TogglePrice from '@/components/UI/Buttons/Toggle/TogglePrice';
import styles from '@/pages/campaign/new/CreatorCampaign.module.scss';
import { LOGO_FULL_DARK } from '@/utils/images';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

/*  */

interface FormHeaderProps {
    session: any;
}

const FormHeader: React.FC<FormHeaderProps> = ({ session }) => {
    return (
        <div className={styles.header}>
            <Link href="/">
                <Image height={18} width={108} src={LOGO_FULL_DARK} alt="logo-full" className={styles.logo} priority />
            </Link>
            <div className={styles.containerPrimary}>
                {/*        <TogglePrice />
                <BtnConnectWallet type="primary" width={166} /> */}
            </div>
        </div>
    );
};

export default FormHeader;
