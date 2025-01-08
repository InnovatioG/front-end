import React from 'react';
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
import styles from "./campaignButtonContainer.module.scss";
import { CardInformationByState } from '@/utils/constants';
import GeneralButtonUI from '@/components/UI/Buttons/UI/Button';
import Link from 'next/link';
import { useModal } from '@/contexts/ModalContext';
import useDraftCard from '@/hooks/useDraftCard';


interface CampaignButtonContainerProps { }

const CampaignButtonContainer: React.FC<CampaignButtonContainerProps> = (props) => {



    const { project, isAdmin, isProtocolTeam } = useProjectDetailStore();



    const campaign = {
        ...project,
        campaign_type: "Target" as const, // Garantiza el valor correcto
    }
    const { buttons } = useDraftCard(campaign, isProtocolTeam, isAdmin);

    const { openModal } = useModal();

    const filteredButtons = buttons.filter(button => button.id !== 1);


    const handleClick = () => {
        localStorage.setItem('project', JSON.stringify(project));
    }


    return (
        <div className={styles.buttonContainerLayout}>
            {isAdmin ? (
                <div className={styles.buttonContainer}>
                    <GeneralButtonUI text={"Contact Support Team"} classNameStyle={"outlineb"}  onClick={() => {
                            openModal('contactSupport', { campaign_id: project.id });
                        }} />
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
                                        onClick={() => button.action && button.action((modalType) => openModal(modalType, { campaign_id: project.id }))}
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
                                    onClick={() => button.action && button.action((modalType) => openModal(modalType, { campaign_id: campaign.id, campaign }))}
                                    classNameStyle={`${button.classNameType} ${buttons.length === 1 ? 'center' : ''}`}
                                >
                                    {buttons.length > 1 && <span className={styles[button.classNameType]}>{'>'}</span>}
                                </GeneralButtonUI>
                            );
                        }
                    })}
                </div>
            ) : (
                project.state_id === 9 && (
                    <div className={styles.buttonContainerInvest}>
                        <Link href={"/invest"}>
                            <GeneralButtonUI text='Invest' classNameStyle='invest' onClick={handleClick} />
                        </Link>
                    </div>
                )
            )}
        </div>
    );
}

export default CampaignButtonContainer;