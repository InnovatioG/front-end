import React from 'react';
import styles from "./form.module.scss"
import { memberFields } from '@/utils/constants';
import Checkbox from '@/components/ui/buttons/checkbox/Checkbox';
import ToolTipInformation from '@/components/General/elements/tooltipInformation/tooltipInformation';
import GeneralButtonUI from '@/components/ui/buttons/UI/Button';

interface FormNewMemberProps {
    newMember: {
        id: string;
        campaign_id: number;
        name: string;
        member_description?: string;
        last_name: string;
        role: string;
        editor: boolean;
        admin: boolean;
        email: string;
        wallet_id?: string;
        wallet_address?: string;
        member_picture?: string;
        member_manage_funds?: boolean;
        website: string;
        facebook: string;
        instagram: string;
        discord: string;
        twitter: string;
    };
    setNewMember: React.Dispatch<React.SetStateAction<{
        id: string;
        campaign_id: number;
        name: string;
        last_name: string;
        role: string;
        editor: boolean;
        admin: boolean;
        email: string;
        wallet_id?: string;
        wallet_address?: string;
        member_picture?: string;
        member_manage_funds?: boolean;
        website: string;
        facebook: string;
        instagram: string;
        discord: string;
        twitter: string;
    }>>;
    setNewMemberField: (key: keyof FormNewMemberProps['newMember'], value: any) => void;
}

const FormNewMember: React.FC<FormNewMemberProps> = ({ newMember, setNewMember, setNewMemberField }) => {
    const socialMedia: Record<Extract<keyof FormNewMemberProps['newMember'], 'website' | 'facebook' | 'instagram' | 'discord' | 'linkedin' | 'twitter'>, string> = {
        website: 'Website',
        facebook: 'Facebook',
        instagram: 'Instagram',
        discord: 'Discord',
        twitter: 'XS',
    };


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
                value={newMember.member_description || ''}
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
                            checked={newMember.admin}
                            onChange={(e) => setNewMemberField('admin', e)}
                            label='Edit Campaign'
                        />
                    </div>
                    <input
                        type="text"
                        placeholder='Email'
                        value={newMember.email}
                        onChange={(e) => setNewMemberField('email', e.target.value)}
                        className={styles.input}
                    />
                    <div className={styles.input}>
                        <Checkbox
                            checked={newMember.member_manage_funds || false}
                            onChange={(e) => setNewMemberField('member_manage_funds', e)}
                            label='Manage Funds'
                        />
                    </div>
                    <input
                        type="text"
                        placeholder='Wallet Address'
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
                            value={newMember[key as keyof typeof socialMedia]} // Indicamos que es un índice válido
                            onChange={(e) => setNewMemberField(key as keyof typeof socialMedia, e.target.value)}
                            className={styles.input}
                        />
                    ))}
                </div>
            </article>
            <div className={styles.buttonContainer}>
                <GeneralButtonUI text='Add Member' onClick={() => { }} />
            </div>
        </section>
    );
}

export default FormNewMember;