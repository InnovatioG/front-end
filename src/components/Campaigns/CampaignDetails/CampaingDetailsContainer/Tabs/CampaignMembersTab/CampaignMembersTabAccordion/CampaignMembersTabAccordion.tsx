import styles from './CampaignMembersTabAccordion.module.scss';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/General/Accordion/Accordion';
import SocialButton from '@/components/General/Buttons/SocialIcon/SocialButton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/General/DefaultAvatar/DefaultAvatar';
import { ICampaignDetails } from '@/hooks/useCampaingDetails';
import { CampaignMemberEntity } from '@/lib/SmartDB/Entities';
import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import { SocialIcons } from '@/utils/constants/constants';
import { formatLink } from '@/utils/formats';
import React from 'react';
import useCampaignMembersTabAccordion, { CampaignMembersTabAccordionProps } from './useCampaignMembersTabAccordion';

const CampaignMembersTabAccordion: React.FC<CampaignMembersTabAccordionProps & ICampaignIdStoreSafe & ICampaignDetails> = (props) => {
    const { handleClickEditButton, editionMode,  members } = useCampaignMembersTabAccordion(props);

    return (
        <div>
            <Accordion type="single" collapsible className={styles.accordionContainer}>
                {members &&
                    members.map((member, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger open={true} toggleOpen={() => {}}>
                                <div className={styles.faqContainer}>
                                    <Avatar big={true}>
                                        <AvatarImage src={formatLink(member.avatar_url || '')} alt={member.name} />
                                        <AvatarFallback>{(member?.name || 'NA').slice(0, 2)}</AvatarFallback>
                                    </Avatar>
                                    <span>
                                        {member.name} {member.last_name}
                                    </span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent open={true}>
                                <div className={styles.contentLayoutHeader}>
                                    <div className={styles.contentHeader}>
                                        <div className={styles.subContentHeader}>
                                            <span className={styles.spanTitle}>Role:</span>
                                            <p className={styles.contentText}>{member.role}</p>
                                        </div>

                                        <div className={styles.subContentHeader}>
                                            <span className={styles.spanTitle}>Social Media:</span>
                                            <div className={styles.subContentHeader}>
                                                <div className={styles.socialMediaContainer}>
                                                    {SocialIcons.map((social) => {
                                                        const link = member[social.name as keyof CampaignMemberEntity]; // Acceso directo
                                                        return (
                                                            link &&
                                                            social && (
                                                                <a href={formatLink(link as string)} key={social.name} target="_blank" rel="noopener noreferrer">
                                                                    <SocialButton icon={social.icon} name={social.name} />
                                                                </a>
                                                            )
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <span className={styles.spanTitle}>Description:</span>
                                        <p className={styles.contentText}>{member.description}</p>
                                    </div>
                                    {editionMode && (
                                        <button className={styles.editButton} onClick={() => handleClickEditButton(member)}>
                                            Edit{' '}
                                        </button>
                                    )}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
            </Accordion>
        </div>
    );
};

export default CampaignMembersTabAccordion;
