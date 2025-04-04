import { Avatar, AvatarFallback, AvatarImage } from '@/components/General/Elements/DefaultAvatar/DefaultAvatar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/UI/Accordion/Accordion';
import SocialButton from '@/components/UI/Buttons/SocialIcon/SocialButton';
import { MembersTeam } from '@/HardCode/databaseType';
import { useCampaignStore } from '@/store/campaign/useCampaignStore';
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
import { socialIcons } from '@/utils/constants';
import { formatLink } from '@/utils/formats';
import { useRouter } from 'next/router';
import React from 'react';
import styles from './ResumeOftheTeam.module.scss';

interface ResumeOfTheTeamAccordionProps {
    onEditMember?: (member: MembersTeam) => void;
}

type SocialMediaKeys = Extract<
    {
        [K in keyof MembersTeam]: MembersTeam[K] extends string ? K : never;
    }[keyof MembersTeam],
    string
>;

const ResumeOfTheTeamAccordion: React.FC<ResumeOfTheTeamAccordionProps> = ({ onEditMember }) => {
    const { project, editionMode } = useProjectDetailStore();
    const { setSelectedMember, setStep } = useCampaignStore();
    const router = useRouter();

    const socialMedia = {
        website: 'Website',
        facebook: 'Facebook',
        instagram: 'Instagram',
        discord: 'Discord',
        linkedin: 'Linkedin',
        xs: 'XS',
    };

    /*************  ✨ Codeium Command ⭐  *************/
    /**
     * If onEditMember prop is provided, call it with the member object as argument.
     * @param {MembersTeam} member - The member to be edited.
     */
    /******  6b1938ec-983b-425c-b6cc-6c7b12b664bf  *******/
    const handleClickEditButton = (member: MembersTeam) => {
        if (onEditMember) {
            onEditMember(member);
        }
    };

    return (
        <div>
            <Accordion type="single" collapsible className={styles.accordionContainer}>
                {project.members_team.map((member, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger open={true} toggleOpen={() => {}}>
                            <div className={styles.faqContainer}>
                                <Avatar big={true}>
                                    <AvatarImage src={formatLink(member.member_picture || '')} alt={member.name} />
                                    <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
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
                                            <span className={styles.spanTitle}>Social Media:</span>
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
                                                                    name={key as 'website' | 'facebook' | 'instagram' | 'discord' | 'linkedin' | 'twitter'}
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
