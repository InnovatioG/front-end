import { ICampaignDetails } from '@/hooks/useCampaingDetails';
import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import Link from 'next/link';
import React from 'react';
import styles from './CampaignNavMenu.module.scss';
import GeneralButtonUI from '@/components/General/Buttons/UI/Button';
import useCampaignNavMenu from './useCampaignNavMenu';
import { CampaignTab } from '@/utils/constants/routes';

const CampaignNavMenu: React.FC<ICampaignIdStoreSafe & ICampaignDetails> = (props: ICampaignIdStoreSafe & ICampaignDetails) => {
    const { campaign, menuView, editionMode } = props;
    const { screenSize, isOpen, setIsOpen, handleTabChangeMobile, handleTabChange } = useCampaignNavMenu(props);
    if (screenSize === 'mobile' || screenSize === 'tablet') {
        return (
            <div className={styles.navContainerMobile}>
                <button
                    onClick={() => {
                        setIsOpen(!isOpen);
                    }}
                    className={styles.menuButton}
                >
                    <div className={styles.line}></div>
                    <div className={styles.line}></div>
                    <div className={styles.line}></div>
                </button>
                <div className={`${styles.menuMobile} ${isOpen ? styles.open : ''}`}>
                    <ul className={styles.bottoncontainermobile}>
                        <button
                            onClick={() => {
                                setIsOpen(!isOpen);
                            }}
                            className={styles.close}
                        >
                            x
                        </button>
                        {Object.values(CampaignTab).map((item, index) => (
                            <li key={index}>
                                <GeneralButtonUI
                                    text={item}
                                    classNameStyle={menuView === item ? 'active-nav' : 'passive-nav-transparent'}
                                    onClick={() => handleTabChangeMobile(item)}
                                />
                            </li>
                        ))}
                    </ul>
                    {editionMode && (
                        <Link href={`./${campaign.campaign._DB_id}`}>
                            <div>
                                <GeneralButtonUI text="Overview" classNameStyle="overview" onClick={() => {}} />
                            </div>
                        </Link>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.navContainer}>
            <ul className={styles.buttonsContainer}>
                {Object.values(CampaignTab).map((item, index) => (
                    <li key={index}>
                        <GeneralButtonUI text={item} classNameStyle={menuView === item ? 'active-nav' : 'passive-nav'} onClick={() => handleTabChange(item)} />
                    </li>
                ))}
            </ul>
            {editionMode && (
                <Link href={`./${campaign.campaign._DB_id}`}>
                    <div>
                        <GeneralButtonUI text="Overview" classNameStyle="overview" onClick={() => {}} />
                    </div>
                </Link>
            )}
        </div>
    );
};

export default CampaignNavMenu;
