import SocialButton from '@/components/General/Buttons/SocialIcon/SocialButton';
import GeneralButtonUI from '@/components/General/Buttons/UI/Button';
import ModalTemplate from '@/components/General/Modal/ModalTemplate';
import { ICampaignDetails } from '@/hooks/useCampaingDetails';
import { CampaignEntity } from '@/lib/SmartDB/Entities';
import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import { SocialIcons } from '@/utils/constants/constants';
import { ButtonType } from '@/utils/constants/stylesAndButtonsByStatusCodeId';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import styles from './CampaignHeaderSocialAndButton.module.scss';
import useCampaignHeaderSocialAndButton from './useCampaignHeaderSocialAndButton';

const CampaignHeaderSocialAndButton: React.FC<ICampaignIdStoreSafe & ICampaignDetails> = (props: ICampaignIdStoreSafe & ICampaignDetails) => {
    const { campaign, setCampaignEX, editionMode, buttonsForHeader } = props;

    const { selectedLink, setSelectedLink, editLinkButton, getPlaceholder, formatSocialLink, openModal, isOpen, setIsOpen } = useCampaignHeaderSocialAndButton(props);

    return (
        <section className={styles.socialMediaCard}>
            {editionMode ? (
                <div className={styles.socialMediaCardContainer}>
                    <button className={styles.buttonSelected} onClick={editLinkButton}>
                        <span>Edit {selectedLink}</span>
                        <Image src={'/img/icons/right-arrow.svg'} alt="next" width={10} height={10} />
                    </button>
                    <article className={styles.socialContainer}>
                        {SocialIcons.map((social) => {
                            return <SocialButton key={social.name} icon={social.icon} name={social.name} setSocialLink={setSelectedLink} />;
                        })}
                    </article>
                </div>
            ) : (
                <>
                    {buttonsForHeader.map((button: ButtonType, index: number) => (
                        <Link key={index} href={button.link ? button.link(campaign.campaign._DB_id) : '#'}>
                            <GeneralButtonUI
                                text={`${button.label} >`}
                                onClick={() => {
                                    if (button.action) {
                                        if (button.classNameType === 'invest') {
                                            button.action(undefined, campaign);
                                        } else {
                                            button.action((modalType) => openModal(modalType, { campaign_id: campaign.campaign._DB_id }));
                                        }
                                    }
                                }}
                                classNameStyle={button.classNameType}
                            ></GeneralButtonUI>
                        </Link>
                    ))}

                    <article className={styles.socialContainer}>
                        {SocialIcons.map((social) => {
                            const socialLink = campaign.campaign[social.name];
                            if (!editionMode && (!socialLink || socialLink.trim() === '')) return null; // No renderizar si el enlace está vacío y no está en modo edición
                            return (
                                <a key={social.name} href={!editionMode ? formatSocialLink(socialLink || '') : '#'} target="_blank" rel="noopener noreferrer">
                                    <SocialButton icon={social.icon} name={social.name} setSocialLink={setSelectedLink} />
                                </a>
                            );
                        })}
                    </article>
                </>
            )}

            <ModalTemplate isOpen={isOpen} setIsOpen={setIsOpen}>
                <div className={styles.modalContainer}>
                    <h2 className={styles.modalTitle}>Edit {selectedLink}</h2>
                    <div className={styles.inputContainer}>
                        <input
                            type="text"
                            value={campaign.campaign[selectedLink] || ''}
                            placeholder={getPlaceholder()}
                            onChange={(e) =>
                                setCampaignEX({
                                    ...campaign,
                                    campaign: new CampaignEntity({ ...campaign.campaign, [selectedLink]: e.target.value }),
                                })
                            }
                            className={styles.input}
                        />
                        <GeneralButtonUI text="Confirm" onClick={() => setIsOpen(false)} />
                    </div>
                </div>
            </ModalTemplate>
        </section>
    );
};

export default CampaignHeaderSocialAndButton;
