import React from 'react';
import styles from "./StepFour.module.scss";
import { useCampaignStore } from '@/store/campaign/useCampaignStore';
import Avatar from '@/components/general/pictureUpload/Avatar';
import SocialButton from '@/components/buttons/socialIcon/SocialButton';
import {
    DISCORD,
    FACEBOOK,
    INSTAGRAM,
    LOGO_FULL_LIGHT,
    XS,
} from "@/utils/images";
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
        <div>
            <Avatar picture={newMember.member_picture} setPicture={(picture) => setNewMemberField('member_picture', picture)} />
            <div>
                <input
                    type="text"
                    placeholder="Name"
                    value={newMember.member_name}
                    onChange={(e) => setNewMemberField('member_name', e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Role"
                    value={newMember.member_role}
                    onChange={(e) => setNewMemberField('member_role', e.target.value)}
                />
            </div>

            <textarea
                className={styles.textarea}
                placeholder="Tell it as a description. Maximum 650 characters"
                value={newMember.member_description}
                onChange={(e) => setNewMemberField('member_description', e.target.value)}
                maxLength={650}
            />
            <div className={styles.characterCount}>{newMember.member_description.length}/650</div>
            <button onClick={handleAddMember}>Agregar otro miembro</button>
        </div>
    );
}

export default StepFour;