import EmptyState from '@/components/CampaignId/Sections/EmptyState';
import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';
import React, { useEffect, useRef, useState } from 'react';
import styles from './ProjectDetail.module.scss';

const ProjectDetail: React.FC = () => {
    const { campaign } = useCampaignIdStore();
    console.log(campaign.campaign_content)
    const campaignContentSorted = (campaign.campaign_content || []).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    const [activeSection, setActiveSection] = useState<number | null>(null);
    const sectionRefs = useRef<HTMLDivElement[]>([]);

    useEffect(() => {
        if (campaignContentSorted.length === 0) return;

        const handleScroll = () => {
            const sections = sectionRefs.current;
            const scrollPosition = window.scrollY + window.innerHeight / 2;
            let currentSectionId: number | null = null;
            for (let i = 0; i < sections.length; i++) {
                const section = sections[i];
                const rect = section.getBoundingClientRect();
                const sectionTop = rect.top + window.scrollY;
                const sectionHeight = rect.height;

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    currentSectionId = campaignContentSorted[i].order ?? null;
                    break;
                }
            }
            const bottomThreshold = document.documentElement.scrollHeight - window.innerHeight - 10;
            if (window.scrollY >= bottomThreshold) {
                currentSectionId = campaignContentSorted[campaignContentSorted.length - 1].order ?? null;
            }

            if (currentSectionId !== null && currentSectionId !== activeSection) {
                setActiveSection(currentSectionId);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [campaignContentSorted, activeSection]);

    const handleClick = (id: number) => {
        const index = campaignContentSorted.findIndex((content) => content.order === id);
        const section = sectionRefs.current[index];
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    if (campaignContentSorted.length === 0) {
        return <EmptyState />;
    }

    return (
        <main className={styles.projectLayout}>
            <div className={styles.sideBarNavagation}>
                <ul className={styles.listContainer}>
                    {campaignContentSorted.map((content) => (
                        <li key={content.order} className={`${styles.buttonList} ${activeSection === content.order ? styles.active : ''}`} onClick={() => content.order !== undefined && handleClick(content.order)}>
                            {content.name}
                        </li>
                    ))}
                </ul>
            </div>
            <div className={styles.content}>
                {campaignContentSorted.map((content, index) => (
                    <div
                        key={content.order}
                        id={`section-${content.order}`}
                        className={styles.container}
                        ref={(el) => {
                            sectionRefs.current[index] = el!;
                        }}
                    >
                        <div className={styles.titleContainer}>
                            <h2 className={styles.title}>{content.name}</h2>
                            <div className={styles.divisor}></div>
                        </div>
                        <div dangerouslySetInnerHTML={{ __html: content.description || '' }} className={styles.content} />
                    </div>
                ))}
            </div>
        </main>
    );
};

export default ProjectDetail;
