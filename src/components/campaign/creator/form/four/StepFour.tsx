import React, { useState } from 'react';


import styles from "./StepFour.module.scss";
import { useCampaignStore } from '@/store/campaign/useCampaignStore';
import Avatar from '@/components/general/pictureUpload/Avatar';
import SocialButton from '@/components/buttons/socialIcon/SocialButton';
import { memberFields, socialIcons } from '@/utils/constants';
import Checkbox from '@/components/buttons/checkbox/Checkbox';
import GeneralButtonUI from '@/components/buttons/UI/Button';



type SocialLinkKeys = "website" | "facebook" | "instagram" | "discord" | "linkedin" | "xs";


//! TODO: Finish 


interface StepFourProps {
    // Define props here
}

interface MembersTeam {
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
    xs: string;

}



const StepFour: React.FC<StepFourProps> = (props) => {
    const { newCampaign, newMember, addMemberToTeam, resetNewMember, setNewMemberField, updateMemberField, } = useCampaignStore();



    const [selectedLink, setSelectedLink] = useState<SocialLinkKeys>("website");
    console.log("selectedLink", selectedLink);
    const isEditing = newMember.id && newCampaign.members_team.some(m => m.id === newMember.id);


    const handleSaveMember = () => {
        if (isEditing) {
            // Update existing member
            Object.keys(newMember).forEach(key => {
                updateMemberField(
                    newMember.id,
                    key as keyof MembersTeam,
                    newMember[key as keyof MembersTeam]
                );
            });
        } else {
            // Add new member with new id
            const memberToAdd = {
                ...newMember,
                id: Date.now() // Ensure new ID for new members
            };
            addMemberToTeam(memberToAdd);
        }
        resetNewMember();
    };

    const disabledSaveMember = !newMember.member_name || !newMember.member_description || !newMember.member_last_name || !newMember.member_role || !newMember.member_email;

    return (
        <section className={styles.containerLayout}>
            <Avatar picture={newMember.member_picture} setPicture={(picture) => setNewMemberField('member_picture', picture)} />
            <div className={styles.inputContainer}>
                {memberFields.map(field => (
                    <input
                        key={field.key}
                        type="text"
                        className={styles.input}
                        placeholder={field.placeholder}
                        value={String(newMember[field.key as keyof typeof newMember])}
                        onChange={(e) => setNewMemberField(field.key as keyof typeof newMember, e.target.value)}
                    />
                ))}
            </div>

            <textarea
                className={styles.textarea}
                placeholder="Tell it as a description. Maximum 650 characters"
                value={newMember.member_description}
                onChange={(e) => setNewMemberField('member_description', e.target.value)}
                maxLength={650}
            />

            <article className={styles.socialContainer}>
                {socialIcons.map(social => (
                    <SocialButton
                        key={social.name}
                        icon={social.icon}
                        name={social.name as SocialLinkKeys}
                        setSocialLink={setSelectedLink}
                    />))}
            </article>

            <input
                type="text"
                className={styles.input}
                name={selectedLink}
                placeholder={selectedLink}
                value={newMember[selectedLink]}
                onChange={(e) => {
                    setNewMemberField(selectedLink, e.target.value);
                }}
            />

            <article className={styles.permissionContainer}>
                <div className={styles.input}>
                    <Checkbox
                        checked={newMember.member_admin}
                        onChange={(e) => setNewMemberField('member_admin', e)}
                        label='Edit Campaign'
                    />
                </div>
                <input type="text" className={styles.input} placeholder="Email" value={newMember.member_email} onChange={(e) => { setNewMemberField("member_email", e.target.value) }} />

            </article>
            <article className={styles.permissionContainer}>
                <div className={styles.input}>
                    <Checkbox
                        checked={newMember.member_manage_funds}
                        onChange={(e) => setNewMemberField('member_manage_funds', e)}
                        label='Manage Funds'
                    />
                </div>
                <input type="text" className={styles.input} placeholder="Wallet Address" value={newMember.member_wallet_address} onChange={(e) => { setNewMemberField("member_wallet_address", e.target.value) }} />
            </article>
            <div className={styles.buttonContainer}>

                <GeneralButtonUI onClick={handleSaveMember} disabled={disabledSaveMember} classNameStyle='outlineb'>
                    {isEditing ? 'Update member' : 'Add new member'}
                </GeneralButtonUI>
                <GeneralButtonUI onClick={() => { }} classNameStyle='fillb' disabled={disabledSaveMember}>
                    Create Project
                </GeneralButtonUI>
            </div>
        </section >
    );
}

export default StepFour;