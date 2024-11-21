import React, { useState } from 'react';
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';

import styles from "./ResumeOftheTeam.module.scss"
import ResumeOfTheTeamAccordion from './ResumeOfTheTeamAccordion';
import FormNewMember from './FormNewMember';
import GeneralButtonUI from '@/components/buttons/UI/Button';
import FramerMotionAnimation from '@/utils/framerMotion';

interface ResumeOfTheTeamProps {
    // Define props here
}

const ResumeOfTheTeam: React.FC<ResumeOfTheTeamProps> = (props) => {
    const [addNewMember, setAddNewMember] = useState(false);
    const [newMember, setNewMember] = useState({
        member_name: '',
        member_last_name: '',
        member_email: '',
        member_role: '',
        member_description: '',
        member_picture: '',
        member_social: {
            facebook: '',
            instagram: '',
            x: '',
            discord: '',
        },
        member_admin: false,
        member_manage_funds: false,
        member_wallet_address: '',
    });

    const members = useProjectDetailStore(state => state.project.members_team);

    const buttonPlaceHolder = (addNewMember: boolean) => {
        return !addNewMember ? "Add a new member" : "Go back";
    }

    const setNewMemberField = (key: keyof typeof newMember, value: any) => {
        setNewMember(prevState => ({
            ...prevState,
            [key]: value
        }));
    };

    const handleEditMember = (member: typeof newMember) => {
        setNewMember(member);
        setAddNewMember(true);
    };

    return (
        <section className={styles.layout}>
            <span className={styles.title}>Active Members</span>
            <ResumeOfTheTeamAccordion onEditMember={handleEditMember} />
            <div style={{ width: "50%" }}>
                <GeneralButtonUI
                    classNameStyle='outline'
                    text={buttonPlaceHolder(addNewMember)}
                    onClick={() => { setAddNewMember(!addNewMember) }}
                />
            </div>
            {addNewMember &&
                <FramerMotionAnimation isVisible={addNewMember}>
                    <FormNewMember newMember={newMember} setNewMember={setNewMember} setNewMemberField={setNewMemberField} />
                </FramerMotionAnimation>
            }
        </section>
    );
}

export default ResumeOfTheTeam;