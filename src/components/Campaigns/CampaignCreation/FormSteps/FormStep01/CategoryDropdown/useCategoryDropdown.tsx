import { useEffect, useState, useRef } from "react"

export default function useCategoryDropdown() {
    const [isOpen, setIsOpen] = useState(false)
    const dropDownRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropDownRef.current && !dropDownRef.current.contains(event.target as Node)) {
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

    const handleOptionClick = (optionValue: string, onChange: (value: string) => void) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return { isOpen, setIsOpen, dropDownRef, contentRef, handleOptionClick }


}