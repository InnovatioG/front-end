import GeneralButtonUI from '@/components/UI/Buttons/UI/Button';
import { useScreenSize } from '@/hooks/useScreenSize';
import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';
import { navMenu, NavMenuItem } from '@/utils/projectDetailsCreation';
import Link from 'next/link';
import React, { useState } from 'react';
import styles from './NavMenuProjectEdition.module.scss';
import useNavMenuProjectEdition from '@/components/CampaignId/Elements/NavMenuProjectEdition/useNavMenuProjectEdition';

interface NavBarProjectEditionProps {
    // Define props here
}

const NavBarProjectEdition: React.FC<NavBarProjectEditionProps> = (props) => {
    const { campaign } = useCampaignIdStore();
    const { _DB_id } = campaign;
    const { menuView, setMenuView, editionMode, screenSize, isOpen, setIsOpen, handleClickButtonMenuMobile } = useNavMenuProjectEdition()
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
                        {navMenu.map((item: NavMenuItem, index) => (
                            <li key={index}>
                                <GeneralButtonUI
                                    text={item}
                                    classNameStyle={menuView === item ? 'active-nav' : 'passive-nav-transparent'}
                                    onClick={() => handleClickButtonMenuMobile(item as 'Campaign Detail' | 'Resume of the team' | 'Roadmap & Milestones' | 'Tokenomics' | 'Q&A')}
                                />
                            </li>
                        ))}
                    </ul>
                    {editionMode && (
                        <Link href={`./${_DB_id}`}>
                            <div>
                                <GeneralButtonUI text="Overview" classNameStyle="overview" onClick={() => { }} />
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
                {navMenu.map((item: NavMenuItem, index) => (
                    <li key={index}>
                        <GeneralButtonUI
                            text={item}
                            classNameStyle={menuView === item ? 'active-nav' : 'passive-nav'}
                            onClick={() => setMenuView(item as 'Campaign Detail' | 'Resume of the team' | 'Roadmap & Milestones' | 'Tokenomics' | 'Q&A')}
                        />
                    </li>
                ))}
            </ul>
            {editionMode && (
                <Link href={`./${_DB_id}`}>
                    <div>
                        <GeneralButtonUI text="Overview" classNameStyle="overview" onClick={() => { }} />
                    </div>
                </Link>
            )}
        </div>
    );
};

export default NavBarProjectEdition;
