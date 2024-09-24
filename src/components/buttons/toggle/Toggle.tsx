import styles from "./Toggle.module.scss";

interface ToggleProps {
  isActive: boolean;
  onClickToggle: () => void;
}

export default function Toggle(props: ToggleProps) {
  const { isActive, onClickToggle } = props;

  const handleClickToggle = () => {
    onClickToggle();
  };
  return (
    <div className={styles.toggleController}>
      <div className={`${styles.toggle}`} onClick={handleClickToggle}>
        <span
          className={`${styles.point} ${isActive ? styles.active : ""}`}
        ></span>
      </div>

    </div>
  );
}
