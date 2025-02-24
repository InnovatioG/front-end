import { useResponsive } from '@/contexts/ResponsiveContext';
import { useGeneralStore } from '@/store/generalStore/useGeneralStore';
import { LOGO_FULL_LIGHT } from '@/utils/constants/images';
import { ROUTES } from '@/utils/constants/routes';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useWalletSession, useWalletStore } from 'smart-db';
import styles from './Header.module.scss';
import HeaderDesktop from './HeaderDesktop';
import HeaderMobile from './HeaderMobile';

export default function Header() {
    const walletStore = useWalletStore();
    const { screenSize } = useResponsive();
    //--------------------------------------
    const router = useRouter();
    //--------------------------------------
    // para que cargue la sesion del wallet
    useWalletSession();
    //--------------------------------------
    const { setWallet, refreshHaveCampaigns, setIsProtocolTeam, _DebugIsProtocolTeam } = useGeneralStore();
    //--------------------------------------
    useEffect(() => {
        if (walletStore.isConnected === true) {
            setWallet(walletStore.info);
            refreshHaveCampaigns(walletStore.info);
            const isProtocolTeam =
                _DebugIsProtocolTeam !== undefined
                    ? _DebugIsProtocolTeam
                    : walletStore.isConnected === true && walletStore.info?.isWalletValidatedWithSignedToken === true && walletStore.isCoreTeam();
            setIsProtocolTeam(isProtocolTeam);
        } else {
            setWallet(undefined);
            refreshHaveCampaigns(undefined);
            setIsProtocolTeam(false);
        }
    }, [walletStore.isConnected, walletStore.info]);
    //--------------------------------------
    if (router.pathname === ROUTES.campaignCreation) {
        return null;
    }
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
