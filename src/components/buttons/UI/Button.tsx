import React from 'react';
import styles from "./Button.module.scss";

interface GeneralButtonUIProps {
    text?: string;
    onClick: () => void;
    disabled?: boolean;
    classNameStyle?: string;
    type?: "button" | "submit" | "reset";
    loading?: boolean;
    children?: React.ReactNode;
}

const GeneralButtonUI: React.FC<GeneralButtonUIProps> = ({
    text,
    onClick,
    disabled,
    classNameStyle,
    type = "button",
    loading = false,
    children
}) => {




    return (
        <button
            type={type}
            className={`${styles.generalButton} ${classNameStyle?.split(' ').map(cls => styles[cls]).join(' ')}`}
            onClick={onClick}
            disabled={disabled || loading}
        >
            {text}
            {children}
        </button>
    );
}

export default GeneralButtonUI;