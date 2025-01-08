import { CHEVRON_RIGHT } from '@/utils/images';
import styles from './BtnDraftActions.module.scss';
import Link from 'next/link';

interface BtnActionsProps {
    type: any;
    url: string;
    adminView: boolean;
    url2: string;
}

interface SubComponentProps {
    url: string;
    text?: string;
}

export default function BtnDraftActions(props: BtnActionsProps) {
    const { type, url, adminView, url2 } = props;

    if (adminView) {
        switch (type) {
            case 'Active':
                return (
                    <div className={styles.groupBtn}>
                        <SecondaryAdminBtn url={url} text="View Campaing" />
                        <PrimaryAdminBtn url={url2} text="Manage campaing" />
                    </div>
                );

            case 'TBL':
                return (
                    <div className={styles.groupBtn}>
                        <SecondaryAdminBtn url={url} text="View Campaing" />
                        <PrimaryAdminBtn url={url2} text="Create contract" />
                    </div>
                );
            case 'Created':
                return (
                    <div className={styles.groupBtn}>
                        <SecondaryAdminBtn url={url} text="Delete contract" />
                        <PrimaryAdminBtn url={url2} text="Sign contract" />
                    </div>
                );
            case 'Signed':
                return (
                    <div className={styles.groupBtn}>
                        <SecondaryAdminBtn url={url} text="Add UTXO" />
                        <PrimaryAdminBtn url={url2} text="Manage UTXO" />
                    </div>
                );
            case 'Ready':
                return (
                    <div className={styles.groupBtn}>
                        <SecondaryAdminBtn url={url} text="Delete" />
                        <PrimaryAdminBtn url={url2} text="Launch" />
                    </div>
                );
            case 'Deleted':
                return (
                    <div className={styles.groupBtn}>
                        <SecondaryAdminBtn url={url} text="View campaign" />
                        <PrimaryAdminBtn url={url2} text="Start again" />
                    </div>
                );
            case 'Ended':
                return (
                    <div className={styles.groupBtn}>
                        <SecondaryAdminBtn url={url} text="Delete" />
                        <PrimaryAdminBtn url={url2} text="Start again" />
                    </div>
                );
            default:
                return null;
        }
    }

    switch (type) {
        case 'Active':
            return <PrimaryBtn url={url} />;
        case 'TBL':
            return <SecondaryBtn url={url} />;
        default:
            return null;
    }
}

const PrimaryBtn = ({ url }: SubComponentProps) => {
    return (
        <Link href={url}>
            <div className={styles.primaryBtn}>
                <p className={styles.text}>View Campaing</p>
                <svg width="14" height="14" className={styles.icon}>
                    <use href={CHEVRON_RIGHT}></use>
                </svg>
            </div>
        </Link>
    );
};

const PrimaryAdminBtn = ({ url, text }: SubComponentProps) => {
    return (
        <Link href={url}>
            <div className={styles.primaryBtn}>
                <p className={styles.text}>{text}</p>
                <svg width="14" height="14" className={styles.icon}>
                    <use href={CHEVRON_RIGHT}></use>
                </svg>
            </div>
        </Link>
    );
};

const SecondaryBtn = ({ url }: SubComponentProps) => {
    return (
        <Link className={styles.secondaryBtn} href={url}>
            <p className={styles.text}>Your campaign is being reviewed by our team</p>
        </Link>
    );
};

const SecondaryAdminBtn = ({ url, text }: SubComponentProps) => {
    return (
        <Link href={url}>
            <div className={styles.secondaryBtn}>
                <p className={styles.text}>{text}</p>
                <svg width="14" height="14" className={styles.icon}>
                    <use href={CHEVRON_RIGHT}></use>
                </svg>
            </div>
        </Link>
    );
};
