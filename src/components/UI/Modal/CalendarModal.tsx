import { useModal } from '@/contexts/ModalContext';
import React, { useState } from 'react';
import GeneralButtonUI from '../Buttons/UI/Button';
import { Calendar } from '../calendar';
import { TimeInput } from '../TimePicker';
import styles from './CalendarModal.module.scss';
interface CalendarModalProps {}

const CalendarModal: React.FC<CalendarModalProps> = ({}) => {
    const { closeModal } = useModal();

    const [dateRange, setDateRange] = React.useState<{ from: Date | undefined; to?: Date | undefined }>({ from: new Date() });
    const [time, setTime] = useState('');

    const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value.replace(/\D/g, '');

        if (value.length > 2) {
            value = value.slice(0, 2) + ':' + value.slice(2, 4);
        }

        setTime(value);
    };
    return (
        <div className={styles.layout}>
            <h1>Select range date</h1>
            <Calendar mode="range" selected={dateRange} onSelect={(range) => range && setDateRange(range)} className="rounded-md border" />
            <div className={styles.hourMinutContainer}>
                <TimeInput id="time-input" value={time} onChange={handleTimeChange} maxLength={5} />
            </div>
            <div className={styles.buttonContainer}>
                <GeneralButtonUI onClick={() => closeModal()} classNameStyle="fillb">
                    Confirm
                </GeneralButtonUI>
            </div>
        </div>
    );
};

export default CalendarModal;
