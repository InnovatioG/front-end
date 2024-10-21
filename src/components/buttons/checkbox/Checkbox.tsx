import styles from "./Checkbox.module.scss";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export default function Checkbox(props: CheckboxProps) {
  const { checked, onChange, label } = props;
  return (
    <label className={styles.checkboxLabel}>
      <div className={`${styles.checkbox} ${checked ? styles.checked : ""}`} onClick={() => onChange(!checked)}>
        {checked && <span className={styles.checkmark}>✔</span>}
      </div>
      <span className={styles.labelText} onClick={() => onChange(!checked)}>
        {label}
      </span>
    </label>
  )
}
