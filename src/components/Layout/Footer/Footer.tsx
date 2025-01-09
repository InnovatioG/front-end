import { DISCORD, FACEBOOK, INSTAGRAM, LOGO_FULL_LIGHT, XS } from '@/utils/images';
import { ROUTES } from '@/utils/routes';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Footer.module.scss';

export default function Footer() {
    return (
        <>
            <div className={styles.footer}>
                <div className={styles.logoSection}>
                    <div className={styles.pictureLogoContainer}>
                        <Link href={ROUTES.home}>
                            <Image layout="fill" objectPosition={'left'} objectFit="contain" src={LOGO_FULL_LIGHT} alt="logo-full" className={styles.logo} priority />
                        </Link>
                    </div>
                    <p className={styles.textFooter}>
                        Help different crowdfunding campaigns become a reality thanks to your contributions, invest in projects, fund purposes and get rewards.
                    </p>
                </div>
                <div className={styles.navSection}>
                    <div className={styles.navGroup}>
                        <h3 className={styles.title}>How it works</h3>
                        <nav className={styles.navItems}>
                            <Link href={ROUTES.home} className={styles.link}>
                                Investment
                            </Link>
                            <Link href={ROUTES.home} className={styles.link}>
                                Airdrop Sale
                            </Link>
                            <Link href={ROUTES.home} className={styles.link}>
                                Airdrop Resale
                            </Link>
                        </nav>
                    </div>
                    <div className={styles.navGroup}>
                        <h3 className={styles.title}>About us</h3>
                        <nav className={styles.navItems}>
                            <Link href={ROUTES.home} className={styles.link}>
                                Innovatio
                            </Link>
                            <Link href={ROUTES.home} className={styles.link}>
                                Partnerships
                            </Link>
                            <Link href={ROUTES.home} className={styles.link}>
                                Contact
                            </Link>
                        </nav>
                    </div>
                    <div className={styles.navGroup}>
                        <h3 className={styles.title}>Innovatio Community</h3>
                        <nav className={styles.navItems}>
                            <Link href={ROUTES.home} className={styles.link}>
                                Join us
                            </Link>
                            <Link href={ROUTES.home} className={styles.link}>
                                Stake Pool Delegation
                            </Link>
                            <Link href={ROUTES.home} className={styles.link}>
                                Discord Community
                            </Link>
                        </nav>
                    </div>
                </div>
                <div className={styles.socialSection}>
                    <Link href={ROUTES.home} className={styles.socialItem}>
                        <svg width="20" height="20" className={styles.icon}>
                            <use href={FACEBOOK}></use>
                        </svg>
                    </Link>
                    <Link href={ROUTES.home} className={styles.socialItem}>
                        <svg width="20" height="20" className={styles.icon}>
                            <use href={INSTAGRAM}></use>
                        </svg>
                    </Link>
                    <Link href={ROUTES.home} className={styles.socialItem}>
                        <svg width="20" height="20" className={styles.icon}>
                            <use href={XS} />
                        </svg>
                    </Link>
                    <Link href={ROUTES.home} className={styles.socialItem}>
                        <svg width="20" height="20" className={styles.icon}>
                            <use href={DISCORD}></use>
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
