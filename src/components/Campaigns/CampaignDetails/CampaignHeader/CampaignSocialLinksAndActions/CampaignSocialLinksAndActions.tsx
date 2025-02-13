import SocialButton from '@/components/General/Buttons/SocialIcon/SocialButton';
import BtnGeneral from '@/components/GeneralOK/Buttons/BtnGeneral/BtnGeneral';
import { BtnCampaignActions } from '@/components/GeneralOK/Buttons/Buttons/BtnCampaignActions/BtnCampaignActions';
import ModalTemplate from '@/components/GeneralOK/Modals/ModalTemplate/ModalTemplate';
import { ICampaignDetails } from '@/hooks/useCampaingDetails';
import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import { ModalsEnums, SocialLinksIcons } from '@/utils/constants/constants';
import { ButtonType } from '@/utils/constants/buttons';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import styles from './CampaignSocialLinksAndActions.module.scss';
import useCampaignSocialLinksAndActions from './useCampaignSocialLinksAndActions';

const CampaignSocialLinksAndActions: React.FC<ICampaignIdStoreSafe & ICampaignDetails> = (props: ICampaignIdStoreSafe & ICampaignDetails) => {
    const { campaign, setCampaign, isEditMode, buttonsForHeader, handles } = props;

    const { selectedLink, setSelectedLink, getPlaceholder, formatSocialLink, editLinkButton, closeModal } = useCampaignSocialLinksAndActions(props);

    const EditSocialLinkModal = () => {
        const [inputValue, setInputValue] = useState(campaign?.campaign[selectedLink] || '');

        const handleConfirm = () => {
            let entity = campaign.campaign;
            entity[selectedLink] = inputValue;
            setCampaign(entity);
            closeModal();
        };

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;
            setInputValue(newValue);
        };

        return (
            <ModalTemplate active={ModalsEnums.EDIT_SOCIAL_LINK}>
                <div className={styles.modalContainer}>
                    <h2 className={styles.modalTitle}>Edit {selectedLink}</h2>
                    <div className={styles.inputContainer}>
                        <input type="text" value={inputValue} placeholder={getPlaceholder()} onChange={handleChange} className={styles.input} />
                        <BtnGeneral text="Confirm" onClick={() => handleConfirm()} />
                    </div>
                </div>
            </ModalTemplate>
        );
    };

    return (
        <section className={styles.socialMediaCard}>
            {isEditMode ? (
                <div className={styles.socialMediaCardContainer}>
                    <button
                        className={styles.buttonSelected}
                        onClick={() => {
                            editLinkButton(<EditSocialLinkModal />);
                        }}
                    >
                        <span>Edit {selectedLink}</span>
                        <Image src={'/img/icons/right-arrow.svg'} alt="next" width={10} height={10} />
                    </button>
                    <article className={styles.socialContainer}>
                        {SocialLinksIcons.map((social) => {
                            return <SocialButton key={social.name} icon={social.icon} name={social.name} setSocialLink={setSelectedLink} />;
                        })}
                    </article>
                </div>
            ) : (
                <>
                    {buttonsForHeader.map((button: ButtonType, index: number) => (
                        <BtnCampaignActions key={index} button={button} data={{ id: campaign.campaign._DB_id }} handles={handles} />
                    ))}

                    <article className={styles.socialContainer}>
                        {SocialLinksIcons.map((social) => {
                            const socialLink = campaign.campaign[social.name];
                            if (!isEditMode && (!socialLink || socialLink.trim() === '')) return null; // No renderizar si el enlace está vacío y no está en modo edición
                            return (
                                <a key={social.name} href={!isEditMode ? formatSocialLink(socialLink || '') : '#'} target="_blank" rel="noopener noreferrer">
                                    <SocialButton icon={social.icon} name={social.name} setSocialLink={setSelectedLink} />
                                </a>
                            );
                        })}
                    </article>
                </>
            )}
        </section>
    );
};

export default CampaignSocialLinksAndActions;
