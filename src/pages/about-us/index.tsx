import styles from '@/pages/about-us/about-us.module.scss';
import React from 'react';

const AboutUsPage: React.FC = (props) => {
    return (
        <main className={styles.layout}>
            <header className={styles.header}>
                <h1>The Innovatio Founder</h1>
                <span className={styles.span}>The Innovatio Founder is a native Cardano crowdfunding platform, disintermediated and with a 100% transparent fund management.</span>
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
        </main>
    );
};

export default AboutUsPage;
