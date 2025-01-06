import React from 'react';
import ResumeOfTheTeamAccordion from '@/components/CampaignCreation/elements/ResumeOfTheTeamAccordion';
import styles from "@/components/campaign/creator/projectEditionContainer/ResumeOftheTeam.module.scss"
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
}

export default ResumeOfTheTeam;