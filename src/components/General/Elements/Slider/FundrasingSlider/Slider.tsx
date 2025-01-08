import React, { useEffect, useRef } from 'react';
import styles from "./Slider.module.scss";

interface SliderProps {
    value: number;
    setValue: (value: number) => void;
    min: number;
    max: number;
    step: number;
}

const Slider: React.FC<SliderProps> = ({ value, setValue, min, max, step }) => {
    const sliderRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (sliderRef.current) {
            const percentage = ((value - min) / (max - min)) * 100;
            sliderRef.current.style.setProperty('--value', `${percentage}%`);
        }
    }, [value]);

    return (
        <input
            ref={sliderRef}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => setValue(parseInt(e.target.value))}
            className={`${styles.slider} ${styles['slider-filled']}`} // Apply styling to the slider
        />
    );
}

export default Slider;