import styles from './index.module.scss';
import React from 'react';
import Image from 'next/image';

const HowItWorksPage: React.FC = () => {
    const howItWorks = [
        {
            number: 1,
            title: `Submit your proposal`,
            description: 'Your crowdfunding process starts with the submission of your proposal on the platform. Here, it is essential to clearly detail the purpose of your project, the resources you need, the milestones you plan to achieve and the committed deliverables.',
            image: '/img/ui/howitworks/a.png',
        },
        {
            number: 2,
            title: `Our team of professionals reviews it`,
            description: `Once submitted, the proposal undergoes a rigorous review process by our team of professionals. This team assesses the feasibility of the project, the clarity of its objectives and its alignment with the expectations of the contributors.`,
            image: `/img/ui/howitworks/b.png`,
        },
        {
            number: 3,
            title: `Get approved and start fundraising`,
            description: `After approval, you are ready to start fundraising. At this stage, a smart contract is created to ensure transparency and traceability of transactions, giving contributors confidence.`,
            image: `/img/ui/howitworks/c.png`,
        },
        {
            number: 4,
            title: `Achieve your goal and deliver on the deliverables.`,
            description: `As you move forward, it is crucial to focus on achieving the objectives defined in your proposal. This includes actively working to meet committed deliverables, ensuring that contributors perceive real, tangible progress on the project.`,
            image: `/img/ui/howitworks/d.png`,
        },
        {
            number: 5,
            title: `Complete all milestones and conclude the campaign.`,
            description: `Finally, by achieving all milestones, you successfully conclude the campaign. This step involves not only delivering the promised results, but also communicating transparently about the impact generated.`,
            image: `/img/ui/howitworks/e.png`,
        },
    ];

    const investCampaign = [
        {
            number: 1,
            title: "Connect your wallet with ADA.",
            description: "Connect your wallet and make sure you have ADA funds available to purchase utility tokens from a campaign and support its funding.",
            image: "/img/ui/howitworks/how-it-works-1.webp",
        },
        {
            number: 2,
            title: "Fund a campaign by purchasing its utility tokens.",
            description: `Discover campaigns, explore projects, and invest in their utility tokens to unlock future rewards.`,
            image: "/img/ui/howitworks/how-it-works-2.webp",
        },
        {
            number: 3,
            title: "Receive and redeem your campaign rewards.",
            description: `Once the campaign successfully reaches its final deadline, redeem your rewards on its website and enjoy the benefits.`,
            image: '/img/ui/howitworks/how-it-works-3.webp',
        }
    ]

    return (
        <main className={styles.layout}>


            <section className={styles.faqContainer}>
                <h2 className={styles.title}>How it Works</h2>
                <span>Follow these simple steps to start your crowdfunding journey on the cardano blockchain</span>
                <div className={styles.faqList}>
                    {howItWorks.map((faq, index) => (

                        <article className={styles.faqItem} key={index}>
                            <div className={styles.faqContent}>
                                <div className={styles.number}>
                                    {faq.number}
                                </div>
                                <div className={styles.divitionLineContainer}>
                                    <div className={styles.divitionLine}></div>
                                    <div className={styles.divitionLineOrange}></div>
                                </div>
                                <div className={styles.textContent}>

                                    <h3 className={styles.faqTitle}>{faq.title}</h3>
                                    <p className={styles.faqDescription}>{faq.description}</p>
                                    <div className={styles.divisorLine}></div>
                                </div>
                            </div>
                            <div className={styles.faqImageContainer}>
                                <Image src={faq.image} alt={faq.title} className={styles.faqImage} layout="fill" objectFit='cover' />
                            </div>

                        </article>
                    ))}
                </div>
            </section>

            <section className={styles.faqContainerB}>
                <h2 className={styles.title}>Invest Campaigns</h2>
                <div className={styles.faqList}>
                    {investCampaign.map((faq, index) => (
                        <article className={styles.faqItemB} key={index}>
                            <div className={styles.faqContent}>
                                <div className={styles.number}>
                                    {faq.number}
                                </div>
                                <div className={styles.divitionLineContainer}>
                                    <div className={styles.divitionLine}></div>
                                    <div className={styles.divitionLineOrange}></div>
                                </div>
                                <div className={styles.textContent}>

                                    <h3 className={styles.faqTitle}>{faq.title}</h3>
                                    <p className={styles.faqDescription}>{faq.description}</p>
                                    <div className={styles.divisorLine}></div>
                                </div>
                            </div>
                            <div className={styles.faqImageContainer}>
                                <Image src={faq.image} alt={faq.title} className={styles.faqImage} layout="fill" objectFit='contain' />
                            </div>

                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
};

export default HowItWorksPage;
