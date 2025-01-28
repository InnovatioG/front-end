import ToolTipInformation from '@/components/General/Elements/TooltipInformation/tooltipInformation';
import Checkbox from '@/components/UI/Buttons/Checkbox/Checkbox';
import GeneralButtonUI from '@/components/UI/Buttons/UI/Button';
import { memberFields } from '@/utils/constants';
import React from 'react';
import styles from './form.module.scss';
import type { MembersTeam } from '@/types/types';
import Avatar from '@/components/General/Elements/PictureUpload/Avatar';

interface FormNewMemberProps {
    newMember: MembersTeam;
    setNewMemberField: (key: keyof MembersTeam, value: any) => void;
    handleSaveMember: () => void;
}

const FormNewMember: React.FC<FormNewMemberProps> = ({ newMember, setNewMemberField, handleSaveMember }) => {
    const socialMedia: Record<Extract<keyof MembersTeam, 'website' | 'facebook' | 'instagram' | 'discord' | 'twitter'>, string> = {
        website: 'Website',
        facebook: 'Facebook',
        instagram: 'Instagram',
        discord: 'Discord',
        twitter: 'Twitter',
    };

    return (
        <section className={styles.formLayout}>
            <div className={styles.avatarContainer}>
                <Avatar picture={newMember.member_picture || ''} setPicture={(picture) => setNewMemberField('member_picture', picture)} />
            </div>
            <div className={styles.inputContainer}>
                {memberFields.map((field) => (
                    <input
                        key={field.key}
                        type="text"
                        placeholder={field.placeholder}
                        value={String(newMember[field.key as keyof MembersTeam])}
                        onChange={(e) => setNewMemberField(field.key as keyof MembersTeam, e.target.value)}
                        className={styles.input}
                    />
                ))}
            </div>

            <textarea
                placeholder="Tell it as a description. Maximum 650 characters"
                value={newMember.member_description || ''}
                onChange={(e) => setNewMemberField('member_description', e.target.value)}
                maxLength={650}
                className={styles.textarea}
            />
            <article>
                <div className={styles.labelHeader}>
                    <label htmlFor="">Permissions</label>
                    <ToolTipInformation content="This user will have the following permissions" />
                </div>
                <div className={styles.permissionContainer}>
                    <div className={styles.input}>
                        <Checkbox checked={newMember.admin || false} onChange={(e) => setNewMemberField('admin', e)} label="Edit Campaign" />
                    </div>
                    <input type="text" placeholder="Email" value={newMember.email} onChange={(e) => setNewMemberField('email', e.target.value)} className={styles.input} />
                    <div className={styles.input}>
                        <Checkbox checked={newMember.member_manage_funds || false} onChange={(e) => setNewMemberField('member_manage_funds', e)} label="Manage Funds" />
                    </div>
                    <input
                        type="text"
                        placeholder="Wallet Address"
                        value={newMember.wallet_address}
                        onChange={(e) => setNewMemberField('wallet_address', e.target.value)}
                        className={styles.input}
                    />
                </div>
            </article>
            <article>
                <div className={styles.labelHeader}>
                    <label htmlFor="">Social Media</label>
                </div>
                <div className={styles.socialContainer}>
                    {Object.entries(socialMedia).map(([key, label]) => (
                        <input
                            key={key}
                            type="text"
                            placeholder={label}
                            value={typeof newMember[key as keyof MembersTeam] === 'boolean' || newMember[key as keyof MembersTeam] === undefined ? '' : String(newMember[key as keyof MembersTeam])} // Indicamos que es un índice válido
                            onChange={(e) => setNewMemberField(key as keyof MembersTeam, e.target.value)}
                            className={styles.input}
                        />
                    ))}
                </div>
            </article>
            <div className={styles.buttonContainer}>
                <GeneralButtonUI text={newMember.id ? "Update Member" : "Add Member"} onClick={handleSaveMember} />
            </div>
        </section>
    );
};

export default FormNewMember;