import React from 'react';
import { navMenu } from '@/utils/projectDetailsCreation';
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
import styles from "./NavMenuProjectEdition.module.scss"
import GeneralButtonUI from '@/components/buttons/UI/Button';
interface NavBarProjectEditionProps {
    // Define props here
}

const NavBarProjectEdition: React.FC<NavBarProjectEditionProps> = (props) => {

    const { menuView, setMenuView } = useProjectDetailStore();

    console.log(menuView);

    return (
        <div className={styles.navContainer}>
            <ul className={styles.buttonsContainer}>
                {navMenu.map((item: any, index) => (
                    <li key={index}>
                        <GeneralButtonUI
                            text={item}
                            classNameStyle={menuView === item ? "active-nav" : "passive-nav"}
                            onClick={() => setMenuView(item)}
                        />
                    </li>
                ))}
            </ul>
            <GeneralButtonUI
                text="Overview"
                classNameStyle="overview"
                onClick={() => console.log("Save")}
            />
        </div>
    );
}

export default NavBarProjectEdition;