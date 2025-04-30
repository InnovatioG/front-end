import { CHECK_ICON } from '@/utils/constants/images';
import styles from './SuccessIcon.module.scss';

export default function SuccessIcon() {
    return (
        <>
            <div className={styles.successCheckmark}>
                <div className={styles.checkIcon}></div>
                <svg width="24" height="24" className={styles.icon}>
                    <use href={CHECK_ICON}></use>
                </svg>
            </div>
        </>
    );
}
