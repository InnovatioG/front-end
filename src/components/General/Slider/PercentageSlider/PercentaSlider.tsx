import { usePercentaSlider } from '@/components/General/Slider/PercentageSlider/usePercentaSlider';
import { formatMoney } from '@/utils/formats';
import React from 'react';
import styles from './PercentaSlider.module.scss';
import { useGeneralStore } from '@/store/generalStore/useGeneralStore';

interface PercentageSliderProps {
    initialLabel: number; // Assuming you want to pass an initial value
    setValue: (value: bigint) => void;
    total: number;
}

const PercentageSlider: React.FC<PercentageSliderProps> = ({ initialLabel, setValue, total }) => {
    const { label, setLabel, handleSliderChange } = usePercentaSlider(initialLabel, setValue, total);
    const { priceADAOrDollar } = useGeneralStore();

    return (
        <div className={styles.labelContainer}>
            <input type="range" className={styles.slider} min={80} max={100} step={1} value={label} onChange={handleSliderChange} />
            <label className={styles.label}>{formatMoney(initialLabel, priceADAOrDollar == 'ada' ? 'ADA' : 'USD')}</label>
        </div>
    );
};

export default PercentageSlider;
