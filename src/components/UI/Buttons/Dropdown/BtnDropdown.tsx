import { CHEVRON_DOWN } from '@/utils/images';
import { useEffect, useRef, useState } from 'react';
import styles from './BtnDropdown.module.scss';

interface DropdownOption {
    value: string;
    label: string;
}

interface CustomDropdownProps {
    options: DropdownOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    width: number;
}

export default function BtnDropdown(props: CustomDropdownProps) {
    const { options, value, onChange, placeholder, width } = props;
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

    const getDisplayLabel = () => {
        if (value === '') return placeholder;
        const selectedOption = options.find((option) => option.value === value);
        return selectedOption ? selectedOption.label : placeholder;
    };

    return (
        <div className={styles.btnDropdown} ref={dropdownRef} onClick={() => setIsOpen(!isOpen)} style={{ width: `${width}px` }}>
            <div className={styles.btnHeader}>
                <p className={styles.label}>{getDisplayLabel()}</p>
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
