import React from 'react';
import { useCampaignStore } from '@/store/campaign/useCampaignStore';
import styles from "./MemberControllerCard.module.scss"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/defaultAvatar/DefaultAvatar"
interface MemberControllerProps {
    // Define props here
}


//! TODO Seleccionar un member desde el menu 

const MemberController: React.FC<MemberControllerProps> = () => {

    const { newCampaign } = useCampaignStore()



    const memberstTeam = newCampaign.members_team


    return (

        <article className={styles.genralContainer}>
            {memberstTeam.length > 0 ? (
                <section>

                    <ul className={styles.cardsContainer}>
                        {memberstTeam.map(member => (
                            <li key={member.id} className={styles.singleCard}>

                                <div className={styles.avatarContainer}>
                                    <Avatar>
                                        <AvatarImage src={member.member_picture} />
                                        <AvatarFallback>{member.member_name.slice(0, 2)}</AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className={styles.informationContainer}>
                                    <h3>{member.member_name} {member.member_last_name}</h3>
                                    <p>{member.member_role}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            ) : (
                null)
            }

        </article>
    );
}

export default MemberController;