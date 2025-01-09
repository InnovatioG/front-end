import { useScreenSize } from '@/hooks/useScreenSize';
import { CHEVRON_RIGHT } from '@/utils/images';
import Link from 'next/link';
import styles from './BtnActions.module.scss';

interface BtnActionsProps {
    type: 'primary' | 'invest' | 'secondary' | 'info';
    url: string;
}

interface SubComponentProps {
    url: string;
}

export default function BtnActions(props: BtnActionsProps) {
    const { type, url } = props;

    switch (type) {
        case 'primary':
            return <PrimaryBtn url={url} />;
        case 'invest':
            return <InvestBtn url={url} />;
        case 'secondary':
            return <SecondaryBtn url={url} />;
        case 'info':
            return <button className={styles.btn}>info</button>;
        default:
            return null;
    }
}

const PrimaryBtn = ({ url }: SubComponentProps) => {
    return (
        <Link href={url}>
            <div className={styles.primaryBtn}>
                <p className={styles.text}>Learn more</p>
                <svg width="14" height="14" className={styles.icon}>
                    <use href={CHEVRON_RIGHT}></use>
                </svg>
            </div>
        </Link>
    );
};

const SecondaryBtn = ({ url }: SubComponentProps) => {
    const screenSize = useScreenSize();
    return (
        <Link href={url}>
            <div className={styles.secondaryBtn}>
                <p className={styles.text}>{screenSize !== 'mobile' && 'View'} Roadmap</p>
                <svg width="14" height="14" className={styles.icon}>
                    <use href={CHEVRON_RIGHT}></use>
                </svg>
            </div>
        </Link>
    );
};

const InvestBtn = ({ url }: SubComponentProps) => {
    return (
        <Link href={url}>
            <div className={styles.investBtn}>
                <p className={styles.text}>Invest</p>
                <svg width="14" height="14" className={styles.icon}>
                    <use href={CHEVRON_RIGHT}></use>
                </svg>
            </div>
        </Link>
    );
};
