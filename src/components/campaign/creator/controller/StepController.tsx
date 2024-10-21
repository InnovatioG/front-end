import styles from "./StepController.module.scss";

interface StepControllerProps {
  step: 1 | 2 | 3 | 4;
}

export default function StepController(props: StepControllerProps) {
  const { step } = props;
  const steps: (1 | 2 | 3 | 4)[] = [1, 2, 3, 4];
  return (
    <div className={styles.stepContainer}>
    {steps.map((stepNumber) => (
      <div
        key={stepNumber}
        className={`${styles.step} ${step === stepNumber ? styles.active : ''}`}
      >
        <span className={styles.text}>
        Step {stepNumber}
        </span>
      </div>
    ))}
  </div>
  )
}
