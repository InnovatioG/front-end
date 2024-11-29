import React, { useState } from 'react';
import SocialButton from '@/components/buttons/socialIcon/SocialButton';
import styles from "./SocialMediaCard.module.scss";
import { socialIcons } from '@/utils/constants';
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
import Image from 'next/image';
import ModalTemplate from '@/components/modal/Modal';
import GeneralButtonUI from '@/components/buttons/UI/Button';

interface SocialMediaCardContainerProps {
    // Define props here
}

// Definir un tipo específico para las claves de redes sociales
type SocialLinkKeys = "website" | "facebook" | "instagram" | "discord" | "linkedin" | "xs";

const SocialMediaCardContainer: React.FC<SocialMediaCardContainerProps> = (props) => {
    const { project, setProject, editionMode } = useProjectDetailStore();
    const [selectedLink, setSelectedLink] = useState<SocialLinkKeys>("website");
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const editLinkButton = () => {
        setModalOpen(true);
    }

    const getPlaceholder = () => {
        const linkValue = project[selectedLink];
        return linkValue && linkValue !== "" ? linkValue : `Enter your ${selectedLink} link`;
    }

    return (
        <section className={styles.socialMediaCard}>
            {editionMode && (
                <button className={styles.buttonSelected} onClick={editLinkButton}>
                    <span>Edit {selectedLink}</span>
                    <Image src={"/img/icons/right-arrow.svg"} alt="next" width={10} height={10} />
                </button>
            )}

            <article className={styles.socialContainer}>
                {socialIcons.map(social => (
                    <SocialButton
                        key={social.name}
                        icon={social.icon}
                        name={social.name as SocialLinkKeys}
                        setSocialLink={setSelectedLink}
                    />
                ))}
            </article>

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