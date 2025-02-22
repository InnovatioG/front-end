import Checkbox from '@/components/General/Buttons/Checkbox/Checkbox';
import AvatarUpload from '@/components/GeneralOK/Avatar/AvatarUpload/AvatarUpload';
import ToolTipInformation from '@/components/General/ToolTipInformation/ToolTipInformation';
import BtnGeneral from '@/components/GeneralOK/Buttons/BtnGeneral/BtnGeneral';
import { CampaignMemberEntity } from '@/lib/SmartDB/Entities';
import { SocialLinksEnums } from '@/utils/constants/constants';
import React, { useState } from 'react';
import styles from './FormCreateOrEditMember.module.scss';

interface FormCreateOrEditMemberProps {
    member?: CampaignMemberEntity;
    handleSaveMember: (member: CampaignMemberEntity) => void;
    handleCancel: () => void;
}

type CampaignMemberEntityKey = keyof CampaignMemberEntity;

const memberFields = [
    { key: 'name', placeholder: 'Name' },
    { key: 'last_name', placeholder: 'Last name' },
    { key: 'role', placeholder: 'Role' },
];

const FormCreateOrEditMember: React.FC<FormCreateOrEditMemberProps> = ({ member: initialMember, handleSaveMember, handleCancel }) => {
    const [member, setMember] = useState<CampaignMemberEntity>(new CampaignMemberEntity(initialMember));

    const setNewMemberField = <Key extends CampaignMemberEntityKey>(key: Key, value: CampaignMemberEntity[Key]) => {
        setMember(new CampaignMemberEntity({ ...member, [key]: value }));
    };

    return (
        <section className={styles.formLayout}>
            <div className={styles.avatarContainer}>
                <AvatarUpload picture={member?.avatar_url || ''} setPicture={(picture) => setNewMemberField('avatar_url', picture)} />
            </div>
            <div className={styles.inputContainer}>
                {memberFields.map((field) => (
                    <input
                        key={field.key}
                        type="text"
                        placeholder={field.placeholder}
                        value={member[field.key as CampaignMemberEntityKey] !== undefined ? (member[field.key as CampaignMemberEntityKey] as string) : ''}
                        onChange={(e) => setNewMemberField(field.key as CampaignMemberEntityKey, e.target.value)}
                        className={styles.input}
                    />
                ))}
            </div>
            <textarea
                placeholder="Tell it as a description. Maximum 650 characters"
                value={member.description || ''}
                onChange={(e) => setNewMemberField('description', e.target.value)}
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
                        <Checkbox checked={member.editor || false} onChange={(e) => setNewMemberField('editor', e)} label="Edit Campaign" />
                    </div>
                    <input type="text" placeholder="Email" value={member.email} onChange={(e) => setNewMemberField('email', e.target.value)} className={styles.input} />
                    <div className={styles.input}>
                        <Checkbox checked={member.admin || false} onChange={(e) => setNewMemberField('admin', e)} label="Manage Funds" />
                    </div>
                    <input
                        type="text"
                        placeholder="Wallet Address"
                        value={member.wallet_address}
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
                    {Object.entries(SocialLinksEnums).map(([key, label]) => (
                        <input
                            key={key}
                            type="text"
                            placeholder={label}
                            value={member[label as CampaignMemberEntityKey] !== undefined ? (member[label as CampaignMemberEntityKey] as string) : ''}
                            onChange={(e) => setNewMemberField(label as CampaignMemberEntityKey, e.target.value)}
                            className={styles.input}
                        />
                    ))}
                </div>
            </article>
            <div className={styles.buttonContainer}>
                <BtnGeneral text={'Cancel'} onClick={() => handleCancel()} />
                <BtnGeneral text={initialMember !== undefined ? 'Update Member' : 'Add Member'} onClick={() => handleSaveMember(member)} />
            </div>
        </section>
    );
};

export default FormCreateOrEditMember;
