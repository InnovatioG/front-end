import React from 'react';
import styles from "./form.module.scss"
import { memberFields } from '@/utils/constants';
import Checkbox from '@/components/buttons/checkbox/Checkbox';
import ToolTipInformation from '@/components/general/tooltipInformation/tooltipInformation';
import GeneralButtonUI from '@/components/buttons/UI/Button';

interface FormNewMemberProps {
    newMember: {
        member_name: string;
        member_last_name: string;
        member_email: string;
        member_role: string;
        member_description: string;
        member_picture: string;
        member_social: {
            facebook: string;
            instagram: string;
            x: string;
            discord: string;
        };
        member_admin: boolean;
        member_manage_funds: boolean;
        member_wallet_address: string;
    };
    setNewMember: React.Dispatch<React.SetStateAction<{
        member_name: string;
        member_last_name: string;
        member_email: string;
        member_role: string;
        member_description: string;
        member_picture: string;
        member_social: {
            facebook: string;
            instagram: string;
            x: string;
            discord: string;
        };
        member_admin: boolean;
        member_manage_funds: boolean;
        member_wallet_address: string;
    }>>;
    setNewMemberField: (key: keyof FormNewMemberProps['newMember'], value: any) => void;
}

const FormNewMember: React.FC<FormNewMemberProps> = ({ newMember, setNewMember, setNewMemberField }) => {
    return (
        <section className={styles.formLayout}>
            <div className={styles.inputContainer}>
                {memberFields.map(field => (
                    <input
                        key={field.key}
                        type="text"
                        placeholder={field.placeholder}
                        value={String(newMember[field.key as keyof typeof newMember])}
                        onChange={(e) => setNewMemberField(field.key as keyof typeof newMember, e.target.value)}
                        className={styles.input}
                    />
                ))}
            </div>

            <textarea
                placeholder="Tell it as a description. Maximum 650 characters"
                value={newMember.member_description}
                onChange={(e) => setNewMemberField('member_description', e.target.value)}
                maxLength={650}
                className={styles.textarea}
            />
            <article>
                <div className={styles.labelHeader}>
                    <label htmlFor="">Permissions</label>
                    <ToolTipInformation content='This user will have the following permissions' />
                </div>
                <div className={styles.permissionContainer}>
                    <div className={styles.input}>
                        <Checkbox
                            checked={newMember.member_admin}
                            onChange={(e) => setNewMemberField('member_admin', e)}
                            label='Edit Campaign'
                        />
                    </div>
                    <input
                        type="text"
                        placeholder='Email'
                        value={newMember.member_email}
                        onChange={(e) => setNewMemberField('member_email', e.target.value)}
                        className={styles.input}
                    />
                    <div className={styles.input}>
                        <Checkbox
                            checked={newMember.member_manage_funds}
                            onChange={(e) => setNewMemberField('member_manage_funds', e)}
                            label='Manage Funds'
                        />
                    </div>
                    <input
                        type="text"
                        placeholder='Wallet Address'
                        value={newMember.member_wallet_address}
                        onChange={(e) => setNewMemberField('member_wallet_address', e.target.value)}
                        className={styles.input}
                    />
                </div>
            </article>
            <article>
                <div className={styles.labelHeader}>
                    <label htmlFor="">Social Media</label>
                </div>
                <div className={styles.socialContainer}>
                    {Object.entries(newMember.member_social).map(([name, link], index) => (
                        <input
                            key={index}
                            type="text"
                            placeholder={name}
                            value={link}
                            onChange={(e) => setNewMemberField('member_social', { ...newMember.member_social, [name]: e.target.value })}
                            className={styles.input}
                        />
                    ))}
                </div>
            </article>
            <div className={styles.buttonContainer}>
                <GeneralButtonUI text='Add Member' onClick={() => console.log('Add Member')} />
            </div>
        </section>
    );
}

export default FormNewMember;