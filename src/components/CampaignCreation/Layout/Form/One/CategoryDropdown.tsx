import { categories } from '@/utils/constants';
import { CHEVRON_DOWN } from '@/utils/images';
import { useEffect, useRef, useState } from 'react';
import styles from './CategoryDropdown.module.scss';

interface CategoryDropdownProps {
    options: { value: string; label: string }[];
    value: string;
    onChange: (value: string) => void;
}

export default function CategoryDropdown(props: CategoryDropdownProps) {
    const { options, value, onChange } = props;
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (contentRef.current) {
            if (isOpen) {
                contentRef.current.style.maxHeight = `${contentRef.current.scrollHeight + 70}px`;
                contentRef.current.style.opacity = '1';
            } else {
                contentRef.current.style.maxHeight = '0';
                contentRef.current.style.opacity = '0';
            }
        }
    }, [isOpen]);

    const handleOptionClick = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div className={`${styles.btnDropdown} ${isOpen ? styles.open : ''}`} ref={dropdownRef} onClick={() => setIsOpen(!isOpen)}>
            <div className={styles.btnHeader}>
                <p className={`${styles.label} ${value !== '' ? styles.selected : ''}`}>{categories.find((category) => category === value)?.toString() || 'Select category'}</p>
                <svg width="14" height="14" className={`${styles.icon} ${isOpen ? styles.open : ''}`}>
                    <use href={CHEVRON_DOWN}></use>
                </svg>
            </div>

            <div className={`${styles.dropdownContent} ${isOpen ? styles.open : ''}`} ref={contentRef}>
                {options.map((option) => (
                    <p key={option.value} className={styles.dropdownItem} onClick={() => handleOptionClick(option.value)}>
                        {option.label}
                    </p>
                ))}
            </div>
        </div>
    );
}
