import React, { useState } from 'react';


import styles from "./StepFour.module.scss";
import { useCampaignStore } from '@/store/campaign/useCampaignStore';
import Avatar from '@/components/General/Elements/PictureUpload/Avatar';
import SocialButton from '@/components/UI/Buttons/SocialIcon/SocialButton';
import { memberFields, socialIcons } from '@/utils/constants';
import Checkbox from '@/components/UI/Buttons/Checkbox/Checkbox';
import GeneralButtonUI from '@/components/UI/Buttons/UI/Button';
import type { MembersTeam } from '@/HardCode/databaseType';


type SocialLinkKeys = "website" | "facebook" | "instagram" | "discord" | "linkedin" | "twitter";


//! TODO: PROBLEM WITH MEMBER ID 



const StepFour: React.FC = (props) => {
    const { newCampaign, newMember, addMemberToTeam, resetNewMember, setNewMemberField, updateMemberField, } = useCampaignStore();


    const [selectedLink, setSelectedLink] = useState<SocialLinkKeys>("website");
    const isEditing = newMember.id && newCampaign.members_team.some(m => m.id === newMember.id);


    const handleSaveMember = () => {
        if (isEditing) {
            // Update existing member
            Object.keys(newMember).forEach(key => {
                updateMemberField(
                    key as keyof MembersTeam,
                    newMember[key as keyof MembersTeam]
                );
            });
        } else {
            // Add new member with new id
            const memberToAdd = {
                ...newMember,
            };
            addMemberToTeam(memberToAdd);
        }
        resetNewMember();
    };

    const disabledSaveMember = !newMember.name || !newMember.member_description || !newMember.last_name || !newMember.role || !newMember.email;

    return (
        <section className={styles.containerLayout}>
            <Avatar picture={newMember.member_picture || ''} setPicture={(picture) => setNewMemberField('member_picture', picture)} />
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
                        checked={newMember.editor}
                        onChange={(e) => setNewMemberField('editor', e)}
                        label='Edit Campaign'
                    />
                </div>
                <input type="text" className={styles.input} placeholder="Email" value={newMember.email} onChange={(e) => { setNewMemberField("email", e.target.value) }} />

            </article>
            <article className={styles.permissionContainer}>
                <div className={styles.input}>
                    <Checkbox
                        checked={newMember.member_manage_funds || false}
                        onChange={(e) => setNewMemberField('member_manage_funds', e)}
                        label='Manage Funds'
                    />
                </div>
                <input type="text" className={styles.input} placeholder="Wallet Address" value={newMember.wallet_address} onChange={(e) => { setNewMemberField("wallet_address", e.target.value) }} />
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