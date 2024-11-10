import React, { useState } from "react";
import styles from "./Checkbox.module.scss";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export default function Checkbox(props: CheckboxProps) {
  const { checked, onChange, label } = props;
  const [hover, setHover] = useState(false);

  return (
    <label className={styles.checkboxLabel}>
      <div
        className={`${styles.checkbox} ${checked ? styles.checked : ""}`}
        onClick={() => onChange(!checked)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <span className={styles.checkmark}>
          {checked ? (hover ? "✖" : "✔") : (hover ? "✔" : "")}
        </span>
      </div>
      <span className={styles.labelText} onClick={() => onChange(!checked)}>
        {label}
      </span>
    </label>
  );
}