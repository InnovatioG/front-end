import AddMore from '@/components/UI/Buttons/AddMore/AddMore';
import { MembersTeam } from '@/HardCode/databaseType';
import FramerMotionAnimation from '@/utils/framerMotion';
import React, { useEffect, useRef, useState } from 'react';
import FormNewMember from './FormNewMember';
import styles from './ResumeOftheTeam.module.scss';
import ResumeOfTheTeamAccordion from './ResumeOfTheTeamAccordion';

interface ResumeOfTheTeamProps {
    // Define props here
}

/* 
id: number;
member_name: string;
member_description: string;
member_last_name: string;
member_role: string;
member_email: string;
member_picture: string;
member_admin: boolean;
member_wallet_address: string;
member_manage_funds: boolean;
website: string;
facebook: string;
instagram: string;
discord: string;
linkedin: string;
xs: string; */
const ResumeOfTheTeam: React.FC<ResumeOfTheTeamProps> = (props) => {
    const [addNewMember, setAddNewMember] = useState(false);
    const [newMember, setNewMember] = useState<MembersTeam>({
        id: '',
        campaign_id: 0,
        name: '',
        last_name: '',
        email: '',
        role: '',
        member_description: '',
        member_picture: '',
        website: '',
        facebook: '',
        instagram: '',
        discord: '',
        linkedin: '',
        twitter: '',
        admin: false,
        member_manage_funds: false,
        wallet_id: '',
        wallet_address: '',
        editor: false,
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
        setNewMember((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

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
