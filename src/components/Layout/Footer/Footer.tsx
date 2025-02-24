import { LOGO_FULL_LIGHT } from '@/utils/constants/images';
import { ROUTES } from '@/utils/constants/routes';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './Footer.module.scss';

export default function Footer() {
    //--------------------------------------
    const router = useRouter();
    //--------------------------------------
    if (router.pathname === ROUTES.campaignCreation) {
        return null;
    }
    //--------------------------------------
    return (
        <>
            <div className={styles.footer}>
                <div className={styles.logoSection}>
                    <div className={styles.pictureLogoContainer}>
                        <Link href={ROUTES.home}>
                            <a>
                                <Image layout="fill" objectPosition={'left'} objectFit="contain" src={LOGO_FULL_LIGHT} alt="logo-full" className={styles.logo} priority />
                            </a>
                        </Link>
                    </div>
                    <p className={styles.textFooter}>
                        Help different crowdfunding campaigns become a reality thanks to your contributions, invest in projects, fund purposes and get rewards.
                    </p>
                </div>
                <div className={styles.navSection}>
                    <div className={styles.navGroup}>
                        <h3 className={styles.title}>
                            <Link href={ROUTES.howitworks} className={styles.link}>
                                How it works
                            </Link>
                        </h3>
                        <nav className={styles.navItems}>
                            <Link href={ROUTES.investment} className={styles.link}>
                                Investment
                            </Link>
                            <Link href={ROUTES.airdropSale} className={styles.link}>
                                Airdrop Sale
                            </Link>
                            <Link href={ROUTES.airdropResale} className={styles.link}>
                                Airdrop Resale
                            </Link>
                        </nav>
                    </div>
                    <div className={styles.navGroup}>
                        <h3 className={styles.title}>
                            <Link href={ROUTES.aboutus} className={styles.link}>
                                About us
                            </Link>
                        </h3>
                        <nav className={styles.navItems}>
                            <Link href={ROUTES.innovatio} className={styles.link}>
                                Innovatio
                            </Link>
                            <Link href={ROUTES.partnerships} className={styles.link}>
                                Partnerships
                            </Link>
                            <Link href={ROUTES.contact} className={styles.link}>
                                Contact
                            </Link>
                        </nav>
                    </div>
                    <div className={styles.navGroup}>
                        <h3 className={styles.title}>Innovatio Community</h3>
                        <nav className={styles.navItems}>
                            <Link href={ROUTES.joinUs} className={styles.link}>
                                Join us
                            </Link>
                            <Link href={ROUTES.stakePoolDelegation} className={styles.link}>
                                Stake Pool Delegation
                            </Link>
                            <Link href={ROUTES.discordCommunity} className={styles.link}>
                                Discord Community
                            </Link>
                        </nav>
                    </div>
                </div>
                <div className={styles.socialSection}>
                    <Link href={ROUTES.facebook} className={styles.socialItem}>
                        <svg width="20" height="20" className={styles.icon}>
                            <use href="#facebook"></use>
                        </svg>
                    </Link>
                    <Link href={ROUTES.instagram} className={styles.socialItem}>
                        <svg width="20" height="20" className={styles.icon}>
                            <use href="#instagram"></use>
                        </svg>
                    </Link>
                    <Link href={ROUTES.twitter} className={styles.socialItem}>
                        <svg width="20" height="20" className={styles.icon}>
                            <use href="#twitter"></use>
                        </svg>
                    </Link>
                    <Link href={ROUTES.discord} className={styles.socialItem}>
                        <svg width="20" height="20" className={styles.icon}>
                            <use href="#discord"></use>
                        </svg>
                    </Link>
                </div>
            </div>
            <div className={styles.rights}>
                <p className={styles.text}>2024 innovatio.co © All rights reserved</p>
            </div>
        </>
    );
}
