import React, { useEffect, useRef, useState } from 'react';
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
import styles from "./ProjectDetail.module.scss";
import EmptyState from "@/components/CampaignId/Sections/EmptyState"

const ProjectDetail: React.FC = () => {
    const { project } = useProjectDetailStore();
    const campaignContentSorted = [...project.campaign_content].sort((a, b) => a.order - b.order);

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
                    currentSectionId = campaignContentSorted[i].id;
                    break;
                }
            }
            const bottomThreshold = document.documentElement.scrollHeight - window.innerHeight - 10;
            if (window.scrollY >= bottomThreshold) {
                currentSectionId = campaignContentSorted[campaignContentSorted.length - 1].id;
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
        const index = campaignContentSorted.findIndex(content => content.id === id);
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
                        <li
                            key={content.id}
                            className={`${styles.buttonList} ${activeSection === content.id ? styles.active : ''}`}
                            onClick={() => handleClick(content.id)}
                        >
                            {content.name}
                        </li>
                    ))}
                </ul>
            </div>
            <div className={styles.content}>
                {campaignContentSorted.map((content, index) => (
                    <div
                        key={content.id}
                        id={`section-${content.id}`}
                        className={styles.container}
                        ref={el => { sectionRefs.current[index] = el!; }}
                    >
                        <div className={styles.titleContainer}>
                            <h2 className={styles.title}>{content.name}</h2>
                            <div className={styles.divisor}></div>
                        </div>
                        <div
                            dangerouslySetInnerHTML={{ __html: content.description }}
                            className={styles.content}
                        />
                    </div>
                ))}
            </div>
        </main>
    );
};

export default ProjectDetail;