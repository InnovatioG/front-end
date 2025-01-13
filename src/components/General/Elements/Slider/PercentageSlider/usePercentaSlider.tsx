import { useEffect, useState } from 'react';
import styles from './PercentaSlider.module.scss';

export const usePercentaSlider = (initialLabel: number, setValue: (value: BigInt) => void, total: number) => {
    const [label, setLabel] = useState(initialLabel);


    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(event.target.value);
        setLabel(newValue);
        setValue(BigInt((newValue * total) / 100));
    };
    useEffect(() => {
        const slider = document.querySelector(`.${styles.slider}`) as HTMLInputElement;
        if (slider) {
            const valuePercentage = ((label - 80) / (100 - 80)) * 100;
            label < 91 ? slider.style.setProperty('--value-percentage', `${valuePercentage + 4}%`) : slider.style.setProperty('--value-percentage', `${valuePercentage - 2}%`);
        }
    }, [label]);


    return {
        label,
        setLabel,
        handleSliderChange
    };


};