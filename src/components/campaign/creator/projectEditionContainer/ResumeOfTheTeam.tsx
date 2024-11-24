import React, { useState, useRef, useEffect } from 'react';
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
import styles from "./ResumeOftheTeam.module.scss";
import ResumeOfTheTeamAccordion from './ResumeOfTheTeamAccordion';
import FormNewMember from './FormNewMember';
import FramerMotionAnimation from '@/utils/framerMotion';
import AddMore from '@/components/buttons/addMore/AddMore';

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

    const formRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (addNewMember && formRef.current) {
            // Utilizamos setTimeout para asegurar que el scroll ocurre después del render
            setTimeout(() => {
                formRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 0);
        }
    }, [addNewMember]);

    const handleEditMember = (member: typeof newMember) => {
        setNewMember(member);
        setAddNewMember(true);
        // No necesitamos shouldScroll; el efecto anterior se encargará del scroll
    };

    const handleAddMore = () => {
        const willOpen = !addNewMember;
        setAddNewMember(willOpen);
        if (willOpen) {
            // El efecto se encargará del scroll
        }
    };

    const setNewMemberField = (key: keyof typeof newMember, value: any) => {
        setNewMember(prevState => ({
            ...prevState,
            [key]: value
        }));
    };

    return (
        <section className={styles.layout}>
            <span className={styles.title}>Active Members</span>
            <ResumeOfTheTeamAccordion onEditMember={handleEditMember} />
            <div className={styles.buttonAddMember}>
                <AddMore isOpen={addNewMember} setIsOpen={setAddNewMember} handleAddMore={handleAddMore} />
            </div>
            {addNewMember &&
                <FramerMotionAnimation isVisible={addNewMember}>
                    <div ref={formRef}>
                        <FormNewMember newMember={newMember} setNewMember={setNewMember} setNewMemberField={setNewMemberField} />
                    </div>
                </FramerMotionAnimation>
            }
        </section>
    );
}

export default ResumeOfTheTeam;