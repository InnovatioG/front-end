import React from 'react';
import styles from "./SelectButton.module.scss"
interface SelectButtonProps {
    onClick: () => void;
    text: string;
    selected: boolean;
}

const SelectButton: React.FC<SelectButtonProps> = ({
    text, onClick, selected
}: SelectButtonProps) => {
    return (
        <button className={`${styles.button} ${selected ? styles.buttonSelected : ''}`} onClick={onClick}>
            {text}
        </button>
    );
}

export default SelectButton;