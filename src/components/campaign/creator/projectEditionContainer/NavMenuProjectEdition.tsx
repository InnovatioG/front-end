import React from 'react';
import { navMenu, NavMenuItem } from '@/utils/projectDetailsCreation';
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
import styles from "./NavMenuProjectEdition.module.scss";
import GeneralButtonUI from '@/components/buttons/UI/Button';
import { useScreenSize } from '@/hooks/useScreenSize';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface NavBarProjectEditionProps {
    // Define props here
}

const NavBarProjectEdition: React.FC<NavBarProjectEditionProps> = (props) => {
    const { menuView, setMenuView, editionMode, project } = useProjectDetailStore();
    const { id } = project
    const screenSize = useScreenSize();



    const [isOpen, setIsOpen] = useState(false);

    const handleClickButtonMenuMobile = (item: "Project Detail" | "Resume of the team" | "Roadmap & Milestones" | "Tokenomics" | "Q&A") => {
        setMenuView(item);
        setIsOpen(!isOpen);
    }



    if (screenSize === 'mobile' || screenSize === 'tablet') {
        return (
            <div className={styles.navContainerMobile}>
                <button onClick={() => { setIsOpen(!isOpen) }} className={styles.menuButton}>
                    <div className={styles.line}></div>
                    <div className={styles.line}></div>
                    <div className={styles.line}></div>
                </button>
                <div className={`${styles.menuMobile} ${isOpen ? styles.open : ''}`}>
                    <ul className={styles.bottoncontainermobile}>
                        <button onClick={() => { setIsOpen(!isOpen) }} className={styles.close}>x</button>
                        {navMenu.map((item: NavMenuItem, index) => (
                            <li key={index}>
                                <GeneralButtonUI
                                    text={item}
                                    classNameStyle={menuView === item ? "active-nav" : "passive-nav-transparent"}
                                    onClick={() => handleClickButtonMenuMobile(item as "Project Detail" | "Resume of the team" | "Roadmap & Milestones" | "Tokenomics" | "Q&A")}
                                />
                            </li>
                        ))}
                    </ul>
                    {editionMode && (
                        <Link href={`./${id}`}>
                            <div>
                                <GeneralButtonUI
                                    text="Overview"
                                    classNameStyle="overview"
                                    onClick={() => { }}
                                />
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
                            classNameStyle={menuView === item ? "active-nav" : "passive-nav"}
                            onClick={() => setMenuView(item as "Project Detail" | "Resume of the team" | "Roadmap & Milestones" | "Tokenomics" | "Q&A")}
                        />
                    </li>
                ))}
            </ul>
            {editionMode && (
                <Link href={`./${id}`}>
                    <div>
                        <GeneralButtonUI
                            text="Overview"
                            classNameStyle="overview"
                            onClick={() => { }}
                        />
                    </div>
                </Link>
            )}
        </div>
    );
}

export default NavBarProjectEdition;