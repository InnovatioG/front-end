import { useEffect, useRef, useState } from 'react';
import useCategoryDropdown from './useCategoryDropdown';
import styles from './CategoryDropdown.module.scss';
import { CHEVRON_DOWN } from '@/utils/constants/images';

interface CategoryDropdownProps {
    options: { value: string; label: string }[];
    value: string | null;
    onChange: (value: string) => void;
}

export default function CategoryDropdown(props: CategoryDropdownProps) {
    const { options, value, onChange } = props;
    const { isOpen, setIsOpen, dropDownRef, contentRef, handleOptionClick } = useCategoryDropdown();
    const selectedLabel = options.find((option) => option.value === value)?.label || 'Select category';

    return (
        <div className={`${styles.btnDropdown} ${isOpen ? styles.open : ''}`} ref={dropDownRef} onClick={() => setIsOpen(!isOpen)}>
            <div className={styles.btnHeader}>
                <p className={`${styles.label} ${value !== null ? styles.selected : ''}`}>{selectedLabel}</p>{' '}
                <svg width="14" height="14" className={`${styles.icon} ${isOpen ? styles.open : ''}`}>
                    <use href={CHEVRON_DOWN}></use>
                </svg>
            </div>

            <div className={`${styles.dropdownContent} ${isOpen ? styles.open : ''}`} ref={contentRef}>
                {options.map((option) => (
                    <p key={option.value} className={styles.dropdownItem} onClick={() => handleOptionClick(option.value, onChange)}>
                        {option.label}
                    </p>
                ))}
            </div>
        </div>
    );
}
