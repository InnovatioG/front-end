import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import styles from './StepController.module.scss';
import { useMemo } from 'react';
import { AvatarDisplay, AvatarFallback, AvatarImage } from '@/components/GeneralOK/Avatar/AvatarDisplay/AvatarDisplay';

interface StepControllerProps {
    step: number;
    setStep: (step: number) => void;
    editingMember: number | undefined;
    setEditingMember: (editingMember: number | undefined) => void;
}

const StepController: React.FC<StepControllerProps & ICampaignIdStoreSafe> = (props: StepControllerProps & ICampaignIdStoreSafe) => {
    const { campaign, setEditingMember, editingMember, step, setStep } = props;
    const members = useMemo(() => [...(campaign.members ?? [])].sort((a, b) => a.order - b.order), [campaign]);

    const steps: (1 | 2 | 3 | 4)[] = [1, 2, 3, 4];

    // TODO: naevagcion por steps? deberia guardar cuales estes fueron completados. genera lios de control. mejor sacar esta naevegacion: onClick={() => setStep(stepNumber)}

    return (
        <div className={styles.stepContainer}>
            {step !== 4 ? (
                steps.map((stepNumber) => (
                    <div key={stepNumber} className={`${styles.step} ${step === stepNumber ? styles.active : ''}`} >
                        <span className={styles.text}>Step {stepNumber}</span>
                    </div>
                ))
            ) : (
                <article className={styles.generalContainer}>
                    {members.length > 0 ? (
                        <section>
                            <ul className={styles.cardsContainer}>
                                {members.map((member) => (
                                    <li
                                        key={member.order}
                                        className={`${styles.singleCard} ${editingMember === member.order ? styles.active : ''}`}
                                        onClick={() => setEditingMember(member.order)}
                                    >
                                        <div className={styles.avatarContainer}>
                                            <AvatarDisplay>
                                                <AvatarImage src={member.avatar_url} />
                                                <AvatarFallback>{member.name && member.name.slice(0, 2)}</AvatarFallback>
                                            </AvatarDisplay>
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
            )}
        </div>
    );
};

export default StepController;
