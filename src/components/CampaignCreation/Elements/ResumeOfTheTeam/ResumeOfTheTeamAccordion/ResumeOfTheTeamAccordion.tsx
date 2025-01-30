import { Avatar, AvatarFallback, AvatarImage } from '@/components/General/Elements/DefaultAvatar/DefaultAvatar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/UI/Accordion/Accordion';
import SocialButton from '@/components/UI/Buttons/SocialIcon/SocialButton';
import { socialIcons } from '@/utils/constants';
import { formatLink } from '@/utils/formats';
import React from 'react';
import styles from '@/components/CampaignCreation/Elements/ResumeOfTheTeam/ResumeOfTheTeamAccordion/ResumeOfTheTeam.module.scss';
import { MembersTeam } from '@/types/types';
import useResumeOfTheTeamAccordion from "@/components/CampaignCreation/Elements/ResumeOfTheTeam/ResumeOfTheTeamAccordion/useResumeOfTheTeamAccordion"

interface ResumeOfTheTeamAccordionProps {
    onEditMember?: (member: MembersTeam) => void;
}

const ResumeOfTheTeamAccordion: React.FC<ResumeOfTheTeamAccordionProps> = ({ onEditMember }) => {
    const { members_team, socialMedia, handleClickEditButton, setSelectedMember, setStep, router, editionMode, campaign } = useResumeOfTheTeamAccordion(onEditMember);

    return (
        <div>
            <Accordion type="single" collapsible className={styles.accordionContainer}>
                {members_team &&
                    members_team.map((member, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger open={true} toggleOpen={() => { }}>
                                <div className={styles.faqContainer}>
                                    <Avatar big={true}>
                                        <AvatarImage src={formatLink(member.member_picture || '')} alt={member.name} />
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
                                                    {Object.entries(socialMedia).map(([key, label]) => {
                                                        const link = member[key as keyof MembersTeam]; // Acceso directo
                                                        const socialIcon = socialIcons.find((icon) => icon.name === key);
                                                        return (
                                                            link &&
                                                            socialIcon && (
                                                                <a href={formatLink(link as string)} key={key} target="_blank" rel="noopener noreferrer">
                                                                    <SocialButton
                                                                        icon={socialIcon.icon}
                                                                        name={key as 'website' | 'facebook' | 'instagram' | 'discord' | 'twitter'}
                                                                    />
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
                                        <p className={styles.contentText}>{member.member_description}</p>
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

export default ResumeOfTheTeamAccordion;
