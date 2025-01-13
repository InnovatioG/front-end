import SocialButton from '@/components/UI/Buttons/SocialIcon/SocialButton';
import GeneralButtonUI from '@/components/UI/Buttons/UI/Button';
import ModalTemplate from '@/components/UI/Modal/ModalTemplate';
import { useModal } from '@/contexts/ModalContext';
import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';
import type { ButtonType } from '@/utils/constants';
import { ButtonsForCampaignPage, socialIcons } from '@/utils/constants';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import styles from './SocialMediaCard.module.scss';
import { useEffect } from 'react';
interface SocialMediaCardContainerProps { }

// Definir un tipo específico para las claves de redes sociales
type SocialLinkKeys = 'website' | 'facebook' | 'instagram' | 'discord' | 'twitter';

const SocialMediaCardContainer: React.FC<SocialMediaCardContainerProps> = (props) => {
    const { campaign, setCampaign, editionMode, isAdmin, isProtocolTeam } = useCampaignIdStore();
    const [selectedLink, setSelectedLink] = useState<SocialLinkKeys>('website');
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [buttons, setButtons] = useState<ButtonType[]>([]);


    const { openModal } = useModal();


    useEffect(() => {
        if (campaign._DB_id !== "") {
            const { buttons } = ButtonsForCampaignPage(Number(campaign.campaign_status_id), isProtocolTeam, isAdmin);
            setButtons(buttons);
        }
    }, [campaign, isProtocolTeam, isAdmin]);

    const editLinkButton = () => {
        setModalOpen(true);
    };

    const getPlaceholder = () => {
        const linkValue = campaign[selectedLink];
        return linkValue && linkValue !== '' ? linkValue : `Enter your ${selectedLink} link`;
    };

    const formatSocialLink = (link: string) => {
        if (!link.startsWith('http://') && !link.startsWith('https://')) {
            return `https://${link}`;
        }
        return link;
    };

    return (
        <section className={styles.socialMediaCard}>
            {editionMode ? (
                <div className={styles.socialMediaCardContainer}>
                    <button className={styles.buttonSelected} onClick={editLinkButton}>
                        <span>Edit {selectedLink}</span>
                        <Image src={'/img/icons/right-arrow.svg'} alt="next" width={10} height={10} />
                    </button>
                    <article className={styles.socialContainer}>
                        {socialIcons.map((social) => {
                            return <SocialButton key={social.name} icon={social.icon} name={social.name as SocialLinkKeys} setSocialLink={setSelectedLink} />;
                        })}
                    </article>
                </div>
            ) : (
                <>
                    {buttons.map((button: ButtonType, index: number) => (
                        <Link key={index} href={button.link ? button.link(Number(campaign._DB_id)) : '#'}>
                            <GeneralButtonUI
                                text={button.label}
                                onClick={() => {
                                    if (button.action) {
                                        if (button.classNameType === 'invest') {
                                            button.action(undefined, campaign);
                                        } else {
                                            button.action((modalType) => openModal(modalType, { campaign_id: campaign._DB_id }));
                                        }
                                    }
                                }}
                                classNameStyle={button.classNameType}
                            >
                                {buttons.length > 1 && <span className={styles[button.classNameType]}>{'>'}</span>}
                            </GeneralButtonUI>
                        </Link>
                    ))}

                    <article className={styles.socialContainer}>
                        {socialIcons.map((social) => {
                            const socialLink = campaign[social.name as SocialLinkKeys];
                            if (!editionMode && (!socialLink || socialLink.trim() === '')) return null; // No renderizar si el enlace está vacío y no está en modo edición
                            return (
                                <a key={social.name} href={!editionMode ? formatSocialLink(socialLink || '') : '#'} target="_blank" rel="noopener noreferrer">
                                    <SocialButton icon={social.icon} name={social.name as SocialLinkKeys} setSocialLink={setSelectedLink} />
                                </a>
                            );
                        })}
                    </article>
                </>
            )}

            <ModalTemplate isOpen={modalOpen} setIsOpen={setModalOpen}>
                <div className={styles.modalContainer}>
                    <h2 className={styles.modalTitle}>Edit {selectedLink}</h2>
                    <div className={styles.inputContainer}>
                        <input
                            type="text"
                            value={campaign[selectedLink] || ''}
                            placeholder={getPlaceholder()}
                            onChange={(e) =>
                                setCampaign({
                                    ...campaign,
                                    [selectedLink]: e.target.value,
                                })
                            }
                            className={styles.input}
                        />
                        <GeneralButtonUI text="Confirm" onClick={() => setModalOpen(false)} />
                    </div>
                </div>
            </ModalTemplate>
        </section>
    );
};

export default SocialMediaCardContainer;
