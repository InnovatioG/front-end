import React from 'react';
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';

import styles from "./ResumeOftheTeam.module.scss"
import ResumeOfTheTeamAccordion from './ResumeOfTheTeamAccordion';
import FormNewMember from './FormNewMember';
import GeneralButtonUI from '@/components/buttons/UI/Button';

import { useState } from 'react';

interface ResumeOfTheTeamProps {
    // Define props here
}

const ResumeOfTheTeam: React.FC<ResumeOfTheTeamProps> = (props) => {

    const [addNewMember, setAddNewMember] = useState(false);

    const members = useProjectDetailStore(state => state.project.members_team);


    const buttonPlaceHolder = (addNewMember: boolean) => {
        return !addNewMember ? "Add a new member" : "Go back";
    }





    return (
        <section className={styles.layout}>
            <h1>Active Members</h1>
            <ResumeOfTheTeamAccordion />
            <div style={{ width: "50%" }}>
                <GeneralButtonUI
                    classNameStyle='outline'
                    text={buttonPlaceHolder(addNewMember)}
                    onClick={() => { setAddNewMember(!addNewMember) }}

                />
            </div>
            {addNewMember && <FormNewMember />}

        </section >
    );
}

export default ResumeOfTheTeam;