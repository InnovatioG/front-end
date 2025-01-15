import styles from '@/pages/about-us/about-us.module.scss';
import React from 'react';
import { formatLink } from '@/utils/formats';
import Image from 'next/image';
import SocialButton from '@/components/UI/Buttons/SocialIcon/SocialButton';
import { socialIcons } from '@/utils/constants';
import { CATALYST, CARDANO, LOGO_FULL_DARK } from '@/utils/images';

const AboutUsPage: React.FC = () => {
    const members_team = [
        {
            name: 'Lorem',
            last_name: 'Ipsum',
            member_picture: 'https://github.com/innovatioG.png',
            role: 'Founder',
            twitter: 'https://twitter.com/javiergarcia_',
            linkedin: 'https://www.linkedin.com/in/javiergarcia-/',
            facebook: 'https://www.facebook.com/javier.garcia.7/',
            instagram: 'https://www.instagram.com/javiergarcia_/',
            discord: 'https://discord.com/users/112304978409466033',
            website: 'https://javiergarcia.com',
            member_description: `Albert Bregman is a seasoned marketing professional with over 15 years of experience in the tech and consumer goods industries. He holds an MBA from Harvard Business School and has led successful campaigns for Fortune 500 companies. Known for his strategic vision and creative flair, John excels in driving brand growth and market.`,
        },
        {
            name: 'Javier',
            last_name: 'Garcia',
            member_picture: 'https://github.com/sarasa.png',
            role: 'Founder',
            twitter: 'https://twitter.com/javiergarcia_',
            linkedin: 'https://www.linkedin.com/in/javiergarcia-/',
            facebook: 'https://www.facebook.com/javier.garcia.7/',
            instagram: 'https://www.instagram.com/javiergarcia_/',
            discord: 'https://discord.com/users/112304978409466033',
            website: 'https://javiergarcia.com',
            member_description: 'Albert Bregman is a seasoned marketing professional with over 15 years of experience in the tech and consumer goods industries. He holds an MBA from Harvard Business School and has led successful campaigns for Fortune 500 companies. Known for his strategic vision and creative flair, John excels in driving brand growth and market.',
        },
        {
            name: 'Lorem',
            last_name: 'Ipsum',
            member_picture: 'https://github.com/innovatioG.png',
            role: 'Founder',
            twitter: 'https://twitter.com/javiergarcia_',
            linkedin: 'https://www.linkedin.com/in/javiergarcia-/',
            facebook: 'https://www.facebook.com/javier.garcia.7/',
            instagram: 'https://www.instagram.com/javiergarcia_/',
            discord: 'https://discord.com/users/112304978409466033',
            website: 'https://javiergarcia.com',
            member_description: `Albert Bregman is a seasoned marketing professional with over 15 years of experience in the tech and consumer goods industries. He holds an MBA from Harvard Business School and has led successful campaigns for Fortune 500 companies. Known for his strategic vision and creative flair, John excels in driving brand growth and market.`,
        },
        {
            name: 'Javier',
            last_name: 'Garcia',
            member_picture: 'https://github.com/sarasa.png',
            role: 'Founder',
            twitter: 'https://twitter.com/javiergarcia_',
            linkedin: 'https://www.linkedin.com/in/javiergarcia-/',
            facebook: 'https://www.facebook.com/javier.garcia.7/',
            instagram: 'https://www.instagram.com/javiergarcia_/',
            discord: 'https://discord.com/users/112304978409466033',
            website: 'https://javiergarcia.com',
            member_description: 'Albert Bregman is a seasoned marketing professional with over 15 years of experience in the tech and consumer goods industries. He holds an MBA from Harvard Business School and has led successful campaigns for Fortune 500 companies. Known for his strategic vision and creative flair, John excels in driving brand growth and market.',
        },
    ];

    return (
        <main className={styles.layout}>
            <header className={styles.header}>
                <h1>The Innovatio Founder</h1>
                <span className={styles.span}>
                    The Innovatio Founder is a native Cardano crowdfunding platform, disintermediated and with a 100% transparent fund management.
                </span>
                <div className={styles.container}>
                    <p className={styles.paragraph}>
                        This project is born from the Project Catalyst program and seeks to develop the first DApp capable of launching crowdfunding campaigns with utility tokens
                        native to the network to raise ADAs and fulfill dreams.
                    </p>
                    <p className={styles.paragraph}>
                        Following the dynamics of Project Catalyst, the campaigns must be separated into Milestones and have well-defined deliverables. The Innovatio Founder team
                        will be in charge of checking the correct execution of the campaign and the funds will be released through batches.
                    </p>
                </div>
            </header>

            <section className={styles.memberListContainer}>
                <h2 className={styles.title}>About our team behind</h2>
                <div className={styles.memberList}>
                    {members_team.map((member) => (
                        <article className={styles.member} key={member.name}>
                            <div className={styles.headerCard}>
                                <div className={styles.imagenContainer}>
                                    <Image src={member.member_picture} alt={`${member.name} ${member.last_name}`} layout="fill" objectFit="cover" />
                                </div>
                                <h4>
                                    {member.name} {member.last_name}
                                </h4>
                            </div>
                            <div className={styles.containerHeader}>
                                <div className={styles.socialMediaContainer}>
                                    <p>Role</p>
                                    <p>{member.role}</p>
                                </div>
                                <div className={styles.socialMediaContainer}>
                                    <p>Social Media</p>
                                    <div className={styles.socialLinks}>
                                        {Object.entries(member)
                                            .filter(([key]) =>
                                                ['website', 'facebook', 'instagram', 'discord', 'linkedin', 'twitter'].includes(key)
                                            )
                                            .map(([key, link]) => {
                                                const socialIcon = socialIcons.find((icon) => icon.name === key);
                                                return (
                                                    link &&
                                                    socialIcon && (
                                                        <a
                                                            href={formatLink(link as string)}
                                                            key={key}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className={styles.socialLink}
                                                        >
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
                            <div>
                                <p>Description</p>
                                <p>{member.member_description}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <footer className={styles.footer}>
                <Image src={CATALYST} alt="Catalyst" width={402} height={91} />
                <Image src={LOGO_FULL_DARK} alt="logo" width={509} height={91} />
                <Image src={CARDANO} alt="Cardano" width={167} height={91} />
            </footer>
        </main>
    );
};

export default AboutUsPage;