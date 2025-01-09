import { LOGO } from '@/utils/images';
import NextImage from 'next/image';
import styles from './LoadingPage.module.scss';

export default function LoadingPage() {
    return (
        <div className={styles.loadingPage}>
            <div className={styles.logoContainer}>
                <NextImage src={LOGO} width={50} height={50} alt="logo" priority />
            </div>
        </div>
    );
}
