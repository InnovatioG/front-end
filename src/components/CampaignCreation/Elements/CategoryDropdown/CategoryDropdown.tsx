import { useEffect, useRef, useState } from 'react';
import styles from "@/components/CampaignCreation/Elements/CategoryDropdown/CategoryDropdown.module.scss"
import { CHEVRON_DOWN } from '@/utils/images';
import useCategoryDropdown from "@/components/CampaignCreation/Elements/CategoryDropdown/useCategoryDropdown"

interface CategoryDropdownProps {
    options: { value: number; label: string }[];
    value: number | null;
    onChange: (value: number) => void;
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