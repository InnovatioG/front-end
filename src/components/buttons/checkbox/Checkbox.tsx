import React, { useState } from "react";
import styles from "./Checkbox.module.scss";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  variant?: boolean
}

export default function Checkbox(props: CheckboxProps) {
  const { checked, onChange, label, variant = false } = props;
  const [hover, setHover] = useState(false);

  return (
    <label className={styles.checkboxLabel}>
      <div
        className={`${styles.checkbox} ${checked ? styles.checked : ""}`}
        onClick={() => onChange(!checked)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/*         {variant && <span className={styles.variant}>+</span>}
 */}
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