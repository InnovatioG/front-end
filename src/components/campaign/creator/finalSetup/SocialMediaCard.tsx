import React, { useState } from 'react';
import SocialButton from '@/components/buttons/socialIcon/SocialButton';
import styles from "./SocialMediaCard.module.scss";
import { socialIcons } from '@/utils/constants';
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
import Image from 'next/image';
interface SocialMediaCardContainerProps {
    // Define props here
}

const SocialMediaCardContainer: React.FC<SocialMediaCardContainerProps> = (props) => {
    const { project } = useProjectDetailStore();
    const [selectedLink, setSelectedLink] = useState<string>("website");

    const editLinkButton = () => { }




    return (
        <section className={styles.socialMediaCard}>
            <button className={styles.buttonSelected}>
                <span>
                    Edit {selectedLink}
                </span>
                <Image src={"/img/icons/right-arrow.svg"} alt="next" width={10} height={10} />
            </button>
            <article className={styles.socialContainer}>
                {socialIcons.map(social => (
                    <SocialButton
                        key={social.name}
                        icon={social.icon}
                        name={social.name}
                        setSocialLink={setSelectedLink}
                    />
                ))}
            </article>
        </section>
    );
}

export default SocialMediaCardContainer;