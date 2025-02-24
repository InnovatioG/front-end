import { formatMoney } from '@/utils/formats';
import React, { useEffect, useState } from 'react';
import styles from './PercentaSlider.module.scss';
import { useGeneralStore } from '@/store/generalStore/useGeneralStore';

interface PercentageSliderProps {
    value: number; 
    setValue: (value: number) => void;
    total: number;
}

const PercentageSlider: React.FC<PercentageSliderProps> = ({ value, setValue, total }) => {
    const { priceADAOrDollar } = useGeneralStore();
    const [percentage, setPercentage] = useState<number>(total > 0 ? (value * 100) / total : 80);

    // ✅ Update percentage when `value` or `total` changes
    useEffect(() => {
        if (total > 0) {
            setPercentage((value * 100) / total);
        }
    }, [value, total]);

    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newPercentage = parseInt(event.target.value, 10);
        setPercentage(newPercentage);
        setValue((newPercentage * total) / 100);
    };

    useEffect(() => {
        const slider = document.querySelector(`.${styles.slider}`) as HTMLInputElement;
        if (slider) {
            const valuePercentage = ((percentage - 80) / (100 - 80)) * 100;
            percentage < 91
                ? slider.style.setProperty('--value-percentage', `${valuePercentage + 4}%`)
                : slider.style.setProperty('--value-percentage', `${valuePercentage - 2}%`);
        }
    }, [percentage]);

    return (
        <div className={styles.labelContainer}>
            <input 
                type="range" 
                className={styles.slider} 
                min={80} 
                max={100} 
                step={1} 
                value={percentage} 
                onChange={handleSliderChange} 
            />
            <label className={styles.label}>{formatMoney(value, priceADAOrDollar === 'ada' ? 'ADA' : 'USD')}</label>
        </div>
    );
};

export default PercentageSlider;
