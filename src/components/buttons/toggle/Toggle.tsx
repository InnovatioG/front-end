import styles from "./Toggle.module.scss";

interface ToggleProps {
  isActive: boolean;
  onClickToggle: () => void;
  disabled: boolean;
}

export default function Toggle(props: ToggleProps) {
  const { isActive, onClickToggle, disabled } = props;

  const handleClickToggle = () => {
    onClickToggle();
  };
  return (
    <div className={styles.toggleController}>
      <div className={`${styles.toggle} ${disabled ? styles.disabled : ""}`} onClick={handleClickToggle}>
        <span
          className={`${styles.point} ${isActive ? styles.active : ""}`}
        ></span>
      </div>

    </div>
  );
}
