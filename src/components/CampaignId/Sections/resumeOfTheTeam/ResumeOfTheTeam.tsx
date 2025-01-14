import ResumeOfTheTeamAccordion from '@/components/CampaignCreation/Elements/ResumeOfTheTeamAccordion/ResumeOfTheTeamAccordion';
import styles from "@/components/CampaignId/Sections/resumeOfTheTeam/ResumeOftheTeam.module.scss"
import React from 'react';
interface ResumeOfTheTeamProps {
    // Define props here
}

const ResumeOfTheTeam: React.FC<ResumeOfTheTeamProps> = (props) => {
    return (
        <section className={styles.layout}>
            <span className={styles.title}>Active Members</span>
            <ResumeOfTheTeamAccordion />
        </section>
    );
};

export default ResumeOfTheTeam;
