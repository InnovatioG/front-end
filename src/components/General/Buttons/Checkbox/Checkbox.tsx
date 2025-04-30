import { useState } from 'react';
import styles from './Checkbox.module.scss';

interface CheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    variant?: boolean;
    hasContent?: boolean | '';
}

export default function Checkbox(props: CheckboxProps) {
    const { checked, onChange, label, variant = false, hasContent = false } = props;
    const [hover, setHover] = useState(false);

    return (
        <label className={styles.checkboxLabel}>
            {!variant ? (
                <div
                    className={`${styles.checkbox} ${checked ? styles.checked : ''}`}
                    onClick={() => onChange(!checked)}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                >
                    <span className={styles.checkmark}>{checked ? (hover ? '✖' : '✔') : hover ? '✔' : ''}</span>
                </div>
            ) : (
                <div
                    onClick={() => onChange(!checked)}
                    className={`${styles.checkboxB} ${checked ? styles.checkedB : ''}`}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                >
                    <span className={styles.checkmarkB}>{checked ? (hover ? '-' : '✔') : hover ? '+' : '+'}</span>
                </div>
            )}

            <span className={styles.labelText} onClick={() => onChange(!checked)}>
                {label}
            </span>
        </label>
    );
}
