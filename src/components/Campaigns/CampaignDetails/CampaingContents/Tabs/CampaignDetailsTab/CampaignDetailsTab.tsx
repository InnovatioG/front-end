import { ICampaignDetails } from '@/hooks/useCampaingDetails';
import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import EmptyState from '../EmpyState/EmptyState';
import styles from './CampaignDetailsTab.module.scss';

const CampaignDetailsTab: React.FC<ICampaignIdStoreSafe & ICampaignDetails> = (props) => {
    const { campaign } = props;
    const campaignContent = useMemo(() => campaign?.contents || [], [campaign]);

    const [activeSection, setActiveSection] = useState<string | null>(campaignContent.length > 0 ? campaignContent[0]._DB_id : null);

    const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
    const activeSectionRef = useRef<string | null>(activeSection); // ✅ Fix stale state issue

    useEffect(() => {
        if (campaignContent.length === 0) return;

        // ✅ Set first section as active on mount
        setActiveSection(campaignContent[0]._DB_id);
        activeSectionRef.current = campaignContent[0]._DB_id;

        const handleScroll = () => {
            const scrollPosition = window.scrollY + window.innerHeight / 2;
            let newActiveSection: string | null = null;

            sectionRefs.current.forEach((section, index) => {
                if (!section) return;
                const rect = section.getBoundingClientRect();
                const sectionTop = rect.top + window.scrollY;
                const sectionBottom = sectionTop + rect.height;

                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    newActiveSection = campaignContent[index]._DB_id;
                }
            });

            // ✅ Handle reaching the bottom of the page
            const bottomThreshold = document.documentElement.scrollHeight - window.innerHeight - 10;
            if (window.scrollY >= bottomThreshold) {
                newActiveSection = campaignContent[campaignContent.length - 1]._DB_id;
            }

            // ✅ Update state only if it's different from the current active section
            if (newActiveSection !== null && newActiveSection !== activeSectionRef.current) {
                activeSectionRef.current = newActiveSection;
                setActiveSection(newActiveSection);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Run on mount

        return () => window.removeEventListener('scroll', handleScroll);
    }, [campaignContent]);

    const handleClick = (id: string) => {
        const index = campaignContent.findIndex((content) => content._DB_id === id);
        const section = sectionRefs.current[index];

        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setActiveSection(id);
            activeSectionRef.current = id; // ✅ Keep reference updated
        }
    };

    if (campaignContent.length === 0) {
        return <EmptyState {...props} />;
    }

    return (
        <main className={styles.projectLayout}>
            <div className={styles.sideBarNavigation}>
                <ul className={styles.listContainer}>
                    {campaignContent.map((content) => (
                        <li
                            key={content.order}
                            className={`${styles.buttonList} ${activeSection === content._DB_id ? styles.active : ''}`}
                            onClick={() => handleClick(content._DB_id)}
                        >
                            {content.name}
                        </li>
                    ))}
                </ul>
            </div>
            <div className={styles.content}>
                {campaignContent.map((content, index) => (
                    <div key={content._DB_id} id={`section-${content._DB_id}`} className={styles.container} ref={(el) => (sectionRefs.current[index] = el)}>
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

export default CampaignDetailsTab;
