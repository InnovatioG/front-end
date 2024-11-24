import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/accordion/Accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/defaultAvatar/DefaultAvatar';
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
import SocialButton from '@/components/buttons/socialIcon/SocialButton';
import { socialIcons } from '@/utils/constants';
import styles from "./ResumeOftheTeam.module.scss"
import { formatLink } from '@/utils/formats';
import { useCampaignStore } from '@/store/campaign/useCampaignStore';
import { MembersTeam } from '@/store/campaign/initialState';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ResumeOfTheTeamAccordionProps {
    onEditMember?: (member: MembersTeam) => void;
}

const ResumeOfTheTeamAccordion: React.FC<ResumeOfTheTeamAccordionProps> = ({ onEditMember }) => {
    const { project, editionMode } = useProjectDetailStore();
    const { setSelectedMember, setStep } = useCampaignStore();
    const router = useRouter();

    const handleClickEditButton = (member: MembersTeam) => {
        if (onEditMember) {
            onEditMember(member);
        }
    };

    return (
        <div>
            <Accordion type="single" collapsible className={styles.accordionContainer}>
                {project.members_team.map((member, index) => (
                    <AccordionItem key={index} value={`item-${index}`} >
                        <AccordionTrigger open={true} toggleOpen={() => { }}>
                            <div className={styles.faqContainer}>
                                <Avatar big={true}>
                                    <AvatarImage src={formatLink(member.member_picture)} alt={member.member_name} />
                                    <AvatarFallback>{member.member_name.slice(0, 2)}</AvatarFallback>
                                </Avatar>
                                <span>
                                    {member.member_name} {member.member_last_name}
                                </span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent open={true}>
                            <div className={styles.contentLayoutHeader}>
                                <div className={styles.contentHeader}>
                                    <div className={styles.subContentHeader}>
                                        <span className={styles.spanTitle}>Role:</span>
                                        <p className={styles.contentText}>{member.member_role}</p>
                                    </div>

                                    <div className={styles.subContentHeader}>
                                        <span className={styles.spanTitle}>
                                            Social Media:
                                        </span>
                                        <div className={styles.socialMediaContainer}>
                                            {Object.entries(member.member_social).map(([name, link], index) => {
                                                const socialIcon = socialIcons.find(icon => icon.name === name);
                                                return (
                                                    link && socialIcon && (
                                                        <a href={formatLink(link)} key={index} target="_blank" rel="noopener noreferrer">
                                                            <SocialButton
                                                                icon={socialIcon.icon}
                                                                name={name}
                                                            />
                                                        </a>
                                                    )
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <span className={styles.spanTitle}>
                                        Description:</span>
                                    <p className={styles.contentText}>{member.member_description}</p>
                                </div>
                                {
                                    editionMode &&
                                    <button
                                        className={styles.editButton}
                                        onClick={() => handleClickEditButton(member)}>Edit </button>
                                }
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}

export default ResumeOfTheTeamAccordion;