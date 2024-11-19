import React, { useState } from 'react';
import styles from "./form.module.scss"
import { memberFields } from '@/utils/constants';
import Checkbox from '@/components/buttons/checkbox/Checkbox';
import ToolTipInformation from '@/components/general/tooltipInformation/tooltipInformation';
import GeneralButtonUI from '@/components/buttons/UI/Button';
interface FormNewMemberProps {
    // Define props here
}

const FormNewMember: React.FC<FormNewMemberProps> = (props) => {
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
            discord: "",

        },
        member_admin: false,
        member_manage_funds: false,
        member_wallet_address: '',
    });

    const setNewMemberField = (key: keyof typeof newMember, value: any) => {
        setNewMember(prevState => ({
            ...prevState,
            [key]: value
        }));
    };

    console.log(newMember);

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