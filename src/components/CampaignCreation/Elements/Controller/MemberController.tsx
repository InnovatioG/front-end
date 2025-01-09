import { Avatar, AvatarFallback, AvatarImage } from '@/components/General/Elements/DefaultAvatar/DefaultAvatar';
import type { MembersTeam } from '@/HardCode/databaseType';
import { useCampaignStore } from '@/store/campaign/useCampaignStore';
import React from 'react';
import styles from './MemberControllerCard.module.scss';

interface MemberControllerProps {
    // Define props here
}

//! TODO Seleccionar un member desde el menu

const MemberController: React.FC<MemberControllerProps> = () => {
    const { newCampaign, setSelectedMember } = useCampaignStore();

    const memberstTeam = newCampaign.members_team;

    const handleSelectMember = (member: MembersTeam) => {
        setSelectedMember(member);
    };

    return (
        <article className={styles.genralContainer}>
            {memberstTeam.length > 0 ? (
                <section>
                    <ul className={styles.cardsContainer}>
                        {memberstTeam.map((member) => (
                            <li key={member.id} className={styles.singleCard} onClick={() => handleSelectMember(member)}>
                                <div className={styles.avatarContainer}>
                                    <Avatar>
                                        <AvatarImage src={member.member_picture} />
                                        <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className={styles.informationContainer}>
                                    <h3>
                                        {member.name} {member.last_name}
                                    </h3>
                                    <p>{member.role}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            ) : null}
        </article>
    );
};

export default MemberController;
