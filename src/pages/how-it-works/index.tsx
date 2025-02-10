import styles from './index.module.scss';
import React from 'react';
import Image from 'next/image';

const HowItWorksPage: React.FC = () => {
    const howItWorks = [
        {
            title: `Submit your proposal`,
            description: 'Your crowdfunding process starts with the submission of your proposal on the platform. Here, it is essential to clearly detail the purpose of your project, the resources you need, the milestones you plan to achieve and the committed deliverables.',
            image: '/img/ui/howitworks/a.png',
        },
        {
            title: `Our team of professionals reviews it`,
            description: `Once submitted, the proposal undergoes a rigorous review process by our team of professionals. This team assesses the feasibility of the project, the clarity of its objectives and its alignment with the expectations of the contributors.`,
            image: `/img/ui/howitworks/b.png`,
        },
        {
            title: `Get approved and start fundraising`,
            description: `After approval, you are ready to start fundraising. At this stage, a smart contract is created to ensure transparency and traceability of transactions, giving contributors confidence.`,
            image: `/img/ui/howitworks/c.png`,
        },
        {
            title: `Achieve your goal and deliver on the deliverables.`,
            description: `As you move forward, it is crucial to focus on achieving the objectives defined in your proposal. This includes actively working to meet committed deliverables, ensuring that contributors perceive real, tangible progress on the project.`,
            image: `/img/ui/howitworks/d.png`,
        },
        {
            title: `Complete all milestones and conclude the campaign.`,
            description: `Finally, by achieving all milestones, you successfully conclude the campaign. This step involves not only delivering the promised results, but also communicating transparently about the impact generated.`,
            image: `/img/ui/howitworks/e.png`,
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

            <section className={styles.faqContainer}>
                <h2 className={styles.title}>How it Works</h2>
                <div className={styles.faqList}>
                    {howItWorks.map((faq, index) => (
                        <article className={styles.faqItem} key={index}>
                            <div className={styles.faqImageContainer}>
                                <Image src={faq.image} alt={faq.title} width={300} height={200} className={styles.faqImage} />
                            </div>
                            <div className={styles.faqContent}>
                                <h3 className={styles.faqTitle}>{faq.title}</h3>
                                <p className={styles.faqDescription}>{faq.description}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
};

export default HowItWorksPage;
