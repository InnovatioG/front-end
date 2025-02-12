import React, { forwardRef } from 'react';
import styles from './BtnGeneral.module.scss';

interface BtnGeneralProps {
    text?: string;
    onClick: () => void;
    disabled?: boolean;
    classNameStyle?: string;
    type?: 'button' | 'submit' | 'reset';
    loading?: boolean;
    children?: React.ReactNode;
    className?: string;
}

const BtnGeneral = forwardRef<HTMLButtonElement, BtnGeneralProps>(
    ({ text, onClick, disabled, classNameStyle, type = 'button', loading = false, children }, ref) => {
        return (
            <button
                ref={ref} // ✅ Pass the ref to the button
                type={type}
                className={`${styles.generalButton} ${classNameStyle
                    ?.split(' ')
                    .map((cls) => styles[cls])
                    .join(' ')}`}
                onClick={onClick}
                disabled={disabled || loading}
            >
                <span className={styles.span}>{text}</span>
                {children}
            </button>
        );
    }
);

BtnGeneral.displayName = 'BtnGeneral';

export default BtnGeneral;