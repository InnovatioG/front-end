import { useGeneralStore } from '@/store/generalStore/useGeneralStore';
import { PLUS_ICON } from '@/utils/constants/images';
import { ROUTES } from '@/utils/constants/routes';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './BtnCampaign.module.scss';

interface BtnCampaignProps {
    type: 'mobile' | 'primary' | 'secondary';
    width?: number;
    closeMenu?: () => void;
}

interface SubComponentProps {
    width?: number;
    closeMenu?: () => void;
    dir: string;
}

const BtnCampaignMobile: React.FC<SubComponentProps> = ({ dir }) => {
    return (
        <Link href={dir} className={styles.btnCampaignMob}>
            <svg width="24" height="24" className={styles.icon}>
                <use href={PLUS_ICON}></use>
            </svg>
        </Link>
    );
};

const BtnCampaignPrimary: React.FC<SubComponentProps> = ({ width, dir }) => {
    const { haveCampaigns } = useGeneralStore();
    return (
        <Link href={dir}>
            <div className={styles.BtnCampaignPrimary} style={width ? { width: `${width}px` } : undefined}>
                <svg width="24" height="24" className={styles.icon}>
                    <use href={PLUS_ICON}></use>
                </svg>
                <p className={styles.text}>{haveCampaigns ? 'Manage Campaigns' : 'Start new campaign'}</p>
            </div>
        </Link>
    );
};

const BtnCampaignSecondary: React.FC<SubComponentProps> = ({ width, closeMenu, dir }) => {
    const { haveCampaigns } = useGeneralStore();
    return (
        <Link href={dir}>
            <div className={styles.btnCampaignSecondary} style={width ? { width: `${width}px` } : undefined} onClick={closeMenu}>
                <svg width="24" height="24" className={styles.icon}>
                    <use href={PLUS_ICON}></use>
                </svg>
                <p className={styles.text}>{haveCampaigns ? 'Manage Campaigns' : 'Start new campaign'}</p>
            </div>
        </Link>
    );
};

const BtnCampaign: React.FC<BtnCampaignProps> = ({ type, width, closeMenu }) => {
    const { haveCampaigns } = useGeneralStore();
    const direction: string = haveCampaigns ? ROUTES.manage : ROUTES.campaignNew;
    switch (type) {
        case 'mobile':
            return <BtnCampaignMobile dir={direction} />;
        case 'primary':
            return <BtnCampaignPrimary width={width} dir={direction} />;
        case 'secondary':
            return <BtnCampaignSecondary width={width} closeMenu={closeMenu} dir={direction} />;
        default:
            return null;
    }
};

export default BtnCampaign;
