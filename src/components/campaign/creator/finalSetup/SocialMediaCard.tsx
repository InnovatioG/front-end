import React, { useState } from 'react';
import SocialButton from '@/components/buttons/socialIcon/SocialButton';
import styles from "./SocialMediaCard.module.scss";
import { socialIcons } from '@/utils/constants';
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
import Image from 'next/image';
import ModalTemplate from '@/components/modal/Modal';
import GeneralButtonUI from '@/components/buttons/UI/Button';
import type { ButtonConfig } from '@/utils/constants';
import { ButtonsForCampaignPage } from '@/utils/constants';
import Link from 'next/link';
import { useModalStore } from '@/store/modal/useModalStoreState';

interface SocialMediaCardContainerProps { }

// Definir un tipo específico para las claves de redes sociales
type SocialLinkKeys = "website" | "facebook" | "instagram" | "discord" | "linkedin" | "xs";

const SocialMediaCardContainer: React.FC<SocialMediaCardContainerProps> = (props) => {
    const { project, setProject, editionMode, isAdmin, isProtocolTeam } = useProjectDetailStore();
    const [selectedLink, setSelectedLink] = useState<SocialLinkKeys>("website");
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    console.log("modalOpen", modalOpen)

    const { openModal } = useModalStore();
    const { buttons } = ButtonsForCampaignPage(project.state_id, isProtocolTeam, isAdmin);


    console.log("editionMode", editionMode)

    const editLinkButton = () => {
        setModalOpen(true);
    }

    const getPlaceholder = () => {
        const linkValue = project[selectedLink];
        return linkValue && linkValue !== "" ? linkValue : `Enter your ${selectedLink} link`;
    }

    const formatSocialLink = (link: string) => {
        if (!link.startsWith('http://') && !link.startsWith('https://')) {
            return `https://${link}`;
        }
        return link;
    }


    return (
        <section className={styles.socialMediaCard}>
            {editionMode ? (
                <div className={styles.socialMediaCardContainer}>
                    <button className={styles.buttonSelected} onClick={editLinkButton}>
                        <span>Edit {selectedLink}</span>
                        <Image src={"/img/icons/right-arrow.svg"} alt="next" width={10} height={10} />
                    </button>
                    <article className={styles.socialContainer}>
                        {socialIcons.map(social => {
                            return (
                                <SocialButton
                                    key={social.name}
                                    icon={social.icon}
                                    name={social.name as SocialLinkKeys}
                                    setSocialLink={setSelectedLink}
                                />
                            );
                        })}
                    </article>
                </div>


            ) : (
                <>
                    {buttons.map((button: ButtonConfig, index: number) => (
                        <Link key={index} href={button.link ? button.link(project.id) : '#'}>
                            <GeneralButtonUI
                                text={button.label}
                                onClick={() => {
                                    if (button.action) {
                                        if (button.classNameType === 'invest') {
                                            button.action(undefined, project);
                                        } else {
                                            button.action((modalType) => openModal(modalType, project.id));
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
                        {socialIcons.map(social => {
                            const socialLink = project[social.name as SocialLinkKeys];
                            if (!editionMode && (!socialLink || socialLink.trim() === "")) return null; // No renderizar si el enlace está vacío y no está en modo edición
                            return (
                                <a
                                    key={social.name}
                                    href={!editionMode ? formatSocialLink(socialLink) : '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <SocialButton
                                        icon={social.icon}
                                        name={social.name as SocialLinkKeys}
                                        setSocialLink={setSelectedLink}
                                    />
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
                            value={project[selectedLink] || ""}
                            placeholder={getPlaceholder()}
                            onChange={(e) => setProject({
                                ...project,
                                [selectedLink]: e.target.value
                            })}
                            className={styles.input}
                        />
                        <GeneralButtonUI text="Confirm" onClick={() => setModalOpen(false)} />
                    </div>
                </div>
            </ModalTemplate>
        </section>
    );
}

export default SocialMediaCardContainer;