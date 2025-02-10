import { useScreenSize } from '@/hooks/useScreenSize';
import { LOGO_FULL_LIGHT } from '@/utils/constants/images';
import { ROUTES } from '@/utils/constants/routes';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { useWalletSession, useWalletStore } from 'smart-db';
import styles from './Header.module.scss';
import HeaderDesktop from './HeaderDesktop';
import HeaderMobile from './HeaderMobile';
import { useGeneralStore } from '@/store/generalStore/useGeneralStore';

export default function Header() {
    const walletStore = useWalletStore();
    const screenSize = useScreenSize();
    //--------------------------------------
    // para que cargue la sesion del wallet
    useWalletSession();
    //--------------------------------------
    useEffect(() => {
        if(walletStore.isConnected === true) {
            useGeneralStore.getState().setWallet(walletStore.info);
            useGeneralStore.getState().refreshHaveCampaigns(walletStore.info);
        }else{
            useGeneralStore.getState().setWallet(undefined);
            useGeneralStore.getState().refreshHaveCampaigns(undefined);
        }
    }, [walletStore.isConnected, walletStore.info]);
    //--------------------------------------
    return (
        <div className={styles.header}>
            <Link href={ROUTES.home}>
                <a>
                    <Image height={18} width={108} src={LOGO_FULL_LIGHT} alt="logo-full" className={styles.logo} priority />
                </a>
            </Link>
            {screenSize === 'mobile' || screenSize === 'tablet' ? <HeaderMobile /> : <HeaderDesktop />}
        </div>
    );
}
