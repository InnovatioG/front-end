import { useScreenSize } from '@/hooks/useScreenSize';
import { LOGO_FULL_LIGHT } from '@/utils/images';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useWalletSession } from 'smart-db';
import styles from './Header.module.scss';
import HeaderDesktop from './HeaderDesktop';
import HeaderMobile from './HeaderMobile';

export default function Header() {
    const screenSize = useScreenSize();
    const { data: session } = useSession();

    const [isOpen, setIsOpen] = useState(false);

    //--------------------------------------
    // para que cargue la sesion del wallet
    useWalletSession();
    //--------------------------------------

    return (
        <div className={styles.header}>
            <Link href="/">
                <Image height={18} width={108} src={LOGO_FULL_LIGHT} alt="logo-full" className={styles.logo} priority />
            </Link>
            {screenSize === 'mobile' || screenSize === 'tablet' ? <HeaderMobile session={session} /> : <HeaderDesktop session={session} setIsOpen={setIsOpen} isOpen={isOpen} />}
        </div>
    );
}
