import React from 'react';
import { Calendar } from '../ui/calendar';
import ModalTemplate from '@/components/modal/Modal';
import styles from "./CalendarModal.module.scss"
interface CalendarModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const CalendarModal: React.FC<CalendarModalProps> = ({ isOpen, setIsOpen, }) => {

    const [date, setDate] = React.useState<Date | undefined>(new Date())

    return (
        <ModalTemplate isOpen={isOpen} setIsOpen={setIsOpen}>
            <div className={styles.layout}>
                <Calendar
                    mode="range"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border" />
            </div>
        </ModalTemplate>
    );
}

export default CalendarModal;