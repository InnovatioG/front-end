import React from 'react';
import styles from "./StepFour.module.scss";
import { useCampaignStore } from '@/store/campaign/useCampaignStore';
import Avatar from '@/components/general/pictureUpload/Avatar';
import SocialButton from '@/components/buttons/socialIcon/SocialButton';
import { memberFields, socialIcons } from '@/utils/constants';
import Checkbox from '@/components/buttons/checkbox/Checkbox';
import Button from '@/components/buttons/UI/Button';

interface StepFourProps {
    // Define props here
}

const StepFour: React.FC<StepFourProps> = (props) => {
    const { newCampaign, newMember, addMemberToTeam, resetNewMember, setNewMemberField } = useCampaignStore();

    console.log(newCampaign)



    const handleAddMember = () => {
        addMemberToTeam(newMember);
        resetNewMember();
    };

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
                        value={newMember[field.key as keyof typeof newMember]}
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
                    <SocialButton key={social.name} icon={social.icon} />
                ))}
            </article>

            <article className={styles.permissionContainer}>
                <div className={styles.input}>
                    <Checkbox
                        checked={newMember.member_admin}
                        onChange={(e) => setNewMemberField('member_admin', e)}
                        label='Edit Campaign'
                    />
                </div>
                <input type="text" className={styles.input} placeholder="Email" />
            </article>
            <div className={styles.buttonContainer}>
                <Button onClick={handleAddMember} classNameStyle='outline' >Continue creating</Button>
                <Button onClick={handleAddMember}>Add member</Button>
            </div>



        </section>
    );
}

export default StepFour;