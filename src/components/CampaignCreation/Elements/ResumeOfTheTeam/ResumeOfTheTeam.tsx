import AddMore from '@/components/UI/Buttons/AddMore/AddMore';
import { MembersTeam } from '@/types/types';
import FramerMotionAnimation from '@/utils/framerMotion';
import React, { useEffect, useRef, useState } from 'react';
import FormNewMember from '@/components/CampaignCreation/Elements/FormNewMember/FormNewMember';
import styles from '@/components/CampaignCreation/Elements/ResumeOfTheTeam/ResumeOftheTeam.module.scss';
import ResumeOfTheTeamAccordion from '@/components/CampaignCreation/Elements/ResumeOfTheTeamAccordion/ResumeOfTheTeamAccordion';
import useResumeOfTheTeam from '@/components/CampaignCreation/Elements/ResumeOfTheTeam/useResumeOfTheTeam';

const ResumeOfTheTeam: React.FC = (props) => {
    const { addNewMember, newMember, formRef, handleEditMember, handleAddMore, setNewMemberField, setNewMember, setAddNewMember } = useResumeOfTheTeam();

    return (
        <section className={styles.layout}>
            <span className={styles.title}>Active Members</span>
            <ResumeOfTheTeamAccordion onEditMember={handleEditMember} />
            <div className={styles.buttonAddMember}>
                <AddMore isOpen={addNewMember} setIsOpen={setAddNewMember} handleAddMore={handleAddMore} />
            </div>
            {addNewMember && (
                <FramerMotionAnimation isVisible={addNewMember}>
                    <div ref={formRef}>
                        <FormNewMember newMember={newMember} setNewMember={setNewMember} setNewMemberField={setNewMemberField} />
                    </div>
                </FramerMotionAnimation>
            )}
        </section>
    );
};

export default ResumeOfTheTeam;
