import React from 'react';
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
import styles from "./campaignButtonContainer.module.scss";
import { cardInformationByState } from '@/utils/constants';
import GeneralButtonUI from '@/components/buttons/UI/Button';
import Link from 'next/link';
import { useModalStore } from '@/store/modal/useModalStoreState';


interface CampaignButtonContainerProps { }

const CampaignButtonContainer: React.FC<CampaignButtonContainerProps> = (props) => {
    const { project, isAdmin } = useProjectDetailStore();
    const { buttons } = cardInformationByState(project.state_id);
    const { openModal } = useModalStore();

    const filteredButtons = buttons.filter(button => button.id !== 1);

    return (
        <div className={styles.buttonContainerLayout}>
            {isAdmin ? (
                <div className={styles.buttonContainer}>
                    <GeneralButtonUI text={"Contact Support Team"} classNameStyle={"outlineb"} onClick={() => { console.log("contact support team") }} />
                    {project.state_id <= 3 && (
                        <Link href={`/campaign/edit?id=${project.id}`}>
                            <GeneralButtonUI text={"Edit Campaign"} classNameStyle={"outlineb"} onClick={() => { }} />
                        </Link>
                    )}
                    {filteredButtons.map((button, index) => {
                        if (button.link) {
                            return (
                                <Link key={index} href={button.link(project.id)}>
                                    <GeneralButtonUI
                                        text={button.label}
                                        onClick={() => button.action && button.action((modalType) => openModal(modalType, project.id))}
                                        classNameStyle={`fillb ${buttons.length === 1 ? 'center' : ''}`}
                                    >
                                        {buttons.length > 1 && <span className={styles[button.classNameType]}>{'>'}</span>}
                                    </GeneralButtonUI>
                                </Link>
                            );
                        } else {
                            return (
                                <GeneralButtonUI
                                    key={index}
                                    text={button.label}
                                    onClick={() => button.action && button.action((modalType) => openModal(modalType, project.id))}
                                    classNameStyle={`fillb ${buttons.length === 1 ? 'center' : ''}`}
                                >
                                    {buttons.length > 1 && <span className={styles[button.classNameType]}>{'>'}</span>}
                                </GeneralButtonUI>
                            );
                        }
                    })}
                </div>
            ) : (
                project.state_id === 9 && (
                    <div className={styles.buttonContainer}>
                        <GeneralButtonUI text='Invest' classNameStyle='fillb' onClick={() => openModal('invest', project.id)} />
                    </div>
                )
            )}
        </div>
    );
}

export default CampaignButtonContainer;