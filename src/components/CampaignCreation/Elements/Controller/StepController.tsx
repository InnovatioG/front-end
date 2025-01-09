import MemberController from './MemberController';
import styles from './StepController.module.scss';

//! TODO Member Controller

interface StepControllerProps {
    step: 1 | 2 | 3 | 4;
}

export default function StepController(props: StepControllerProps) {
    const { step } = props;
    const steps: (1 | 2 | 3 | 4)[] = [1, 2, 3, 4];

    return (
        <div className={styles.stepContainer}>
            {step !== 4 ? (
                steps.map((stepNumber) => (
                    <div key={stepNumber} className={`${styles.step} ${step === stepNumber ? styles.active : ''}`}>
                        <span className={styles.text}>Step {stepNumber}</span>
                    </div>
                ))
            ) : (
                <MemberController />
            )}
        </div>
    );
}
