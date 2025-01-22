import GeneralButtonUI from '@/components/UI/Buttons/UI/Button';
import { useModal } from '@/contexts/ModalContext';
import useDraftCard from '@/hooks/useDraftCard';
import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';
import Link from 'next/link';
import React from 'react';
import styles from './campaignButtonContainer.module.scss';
import { CampaignStatus } from '@/utils/constants/status';
interface CampaignButtonContainerProps { }

const CampaignButtonContainer: React.FC<CampaignButtonContainerProps> = (props) => {
    const { campaign, isAdmin, isProtocolTeam } = useCampaignIdStore();

    /*     const campaign = {
            ...project,
            campaign_type: 'Target' as const, // Garantiza el valor correcto
        }; */
    const { buttons, getInternalId } = useDraftCard(campaign, isProtocolTeam, isAdmin);

    const { openModal } = useModal();

    const filteredButtons = buttons.filter((button) => button.id !== 1);
    const interalId = campaign.campaign_status_id ? getInternalId(campaign.campaign_status_id) : undefined;


    return (
        <div className={styles.buttonContainerLayout}>
            {isAdmin ? (
                <div className={styles.buttonContainer}>
                    <GeneralButtonUI
                        text={'Contact Support Team'}
                        classNameStyle={'outlineb'}
                        onClick={() => {
                            openModal('contactSupport', { campaign_id: campaign._DB_id });
                        }}
                    />
                    {campaign.campaign_status_id && Number(campaign.campaign_status_id) <= 3 && (
                        <Link href={`/campaign/edit?id=${campaign._DB_id}`}>
                            <GeneralButtonUI text={'Edit Campaign'} classNameStyle={'outlineb'} onClick={() => { }} />
                        </Link>
                    )}
                    {filteredButtons.map((button, index) => {
                        if (button.link) {
                            return (
                                <Link key={index} href={button.link(Number(campaign._DB_id))}>
                                    <GeneralButtonUI
                                        text={button.label}
                                        onClick={() => button.action && button.action((modalType) => openModal(modalType, { campaign_id: campaign._DB_id }))}
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
                                    onClick={() => button.action && button.action((modalType) => openModal(modalType, { campaign_id: campaign._DB_id, campaign }))}
                                    classNameStyle={`${button.classNameType} ${buttons.length === 1 ? 'center' : ''}`}
                                >
                                    {buttons.length > 1 && <span className={styles[button.classNameType]}>{'>'}</span>}
                                </GeneralButtonUI>
                            );
                        }
                    })}
                </div>
            ) : (
                Number(interalId) === CampaignStatus.FUNDRAISING && (
                    <div className={styles.buttonContainerInvest}>
                        <Link href={`/invest?id=${campaign._DB_id}`}>
                            <GeneralButtonUI text="Invest" classNameStyle="invest" onClick={() => { }} />
                        </Link>
                    </div>
                )
            )}
        </div>
    );
};

export default CampaignButtonContainer;
