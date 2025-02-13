import { ICampaignDetails } from '@/hooks/useCampaingDetails';
import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import Link from 'next/link';
import React from 'react';
import styles from './CampaignNavMenu.module.scss';
import BtnGeneral from '@/components/GeneralOK/Buttons/BtnGeneral/BtnGeneral';
import useCampaignNavMenu from './useCampaignNavMenu';
import { CampaignTabEnum } from '@/utils/constants/routes';
import { PageViewEnums } from '@/utils/constants/routes';
import { BtnCampaignActions } from '@/components/GeneralOK/Buttons/Buttons/BtnCampaignActions/BtnCampaignActions';
import { ButtonsForCardsEnum, ButtonForDetails, ButtonsForDetailsEnum } from '@/utils/constants/buttons';

const CampaignNavMenu: React.FC<ICampaignIdStoreSafe & ICampaignDetails> = (props: ICampaignIdStoreSafe & ICampaignDetails) => {
    const { campaign, campaignTab, isEditMode, pageView } = props;
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
                        {Object.values(CampaignTabEnum).map((item, index) => (
                            <li key={index}>
                                <BtnGeneral
                                    text={item}
                                    classNameStyle={campaignTab === item ? 'active-nav' : 'passive-nav-transparent'}
                                    onClick={() => handleTabChangeMobile(item)}
                                />
                            </li>
                        ))}
                    </ul>
                    {/* {pageView === PageViewEnums.MANAGE && isEditMode === false && (
                        <BtnCampaignActions button={ButtonForDetails[ButtonsForDetailsEnum.RENDER_CAMPAIGN_FOR_PAGE]} data={{ id: campaign.campaign._DB_id }} />
                    )} */}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.navContainer}>
            <ul className={styles.buttonsContainer}>
                {Object.values(CampaignTabEnum).map((item, index) => (
                    <li key={index}>
                        <BtnGeneral text={item} classNameStyle={campaignTab === item ? 'active-nav' : 'passive-nav'} onClick={() => handleTabChange(item)} />
                    </li>
                ))}
            </ul>
            {/* {pageView === PageViewEnums.MANAGE && isEditMode === false && (
                <BtnCampaignActions button={ButtonForDetails[ButtonsForDetailsEnum.RENDER_CAMPAIGN_FOR_PAGE]} data={{ id: campaign.campaign._DB_id }} />
            )} */}
        </div>
    );
};

export default CampaignNavMenu;
