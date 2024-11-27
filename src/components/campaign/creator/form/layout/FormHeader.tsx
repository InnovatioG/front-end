import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import BtnConnectWallet from '@/components/buttons/connectWallet/BtnConnectWallet';
import GoogleConnect from '@/components/buttons/googleConnect/GoogleConnect';
import { LOGO_FULL_DARK } from '@/utils/images';
import styles from '@/pages/campaign/new/CreatorCampaign.module.scss';

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
            {session === null ? <BtnConnectWallet type="primary" width={166} /> : <GoogleConnect loggedIn={true} />}
        </div>
    );
};

export default FormHeader;
