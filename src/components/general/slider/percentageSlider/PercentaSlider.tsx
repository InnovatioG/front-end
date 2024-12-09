import React, { useState, useEffect } from 'react';
import styles from "./PercentaSlider.module.scss";
import { formatMoney } from '@/utils/formats';
import { usePriceStore } from '@/store/price/usepriceAdaOrDollar';

interface PercentageSliderProps {
    initialLabel: number; // Assuming you want to pass an initial value
    setValue: (value: number) => void;
}

const PercentageSlider: React.FC<PercentageSliderProps> = ({ initialLabel, setValue }) => {
    const [label, setLabel] = useState(initialLabel);
    const { priceAdaOrDollar } = usePriceStore()


    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(event.target.value);
        setLabel(newValue);
        setValue(newValue);
    };


    useEffect(() => {
        const slider = document.querySelector(`.${styles.slider}`) as HTMLInputElement;
        if (slider) {
            const valuePercentage = ((label - 80) / (100 - 80)) * 100;
            label < 91 ? slider.style.setProperty('--value-percentage', `${valuePercentage + 4}%`) :
                slider.style.setProperty('--value-percentage', `${valuePercentage - 2}%`);
        }
    }, [label]);



    return (
        <div className={styles.labelContainer}>
            <input
                type="range"
                className={styles.slider}
                min={80} max={100}
                step={1}
                value={label}
                onChange={handleSliderChange}
            />
            <label className={styles.label}>{formatMoney(initialLabel, priceAdaOrDollar == "ada" ? "ADA" : "USD")}</label>
        </div>
    );
}

export default PercentageSlider;