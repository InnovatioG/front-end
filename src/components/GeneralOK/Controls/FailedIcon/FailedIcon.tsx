import { CLOSE_ICON } from '@/utils/constants/images';
import styles from './FailedIcon.module.scss';

export default function FailedIcon() {
    return (
        <div className={styles.failedCheckmark}>
            <div className={styles.crossIcon}></div>
            <svg width="24" height="24" className={styles.icon}>
                <use href={CLOSE_ICON}></use>
            </svg>
        </div>
    );
}
