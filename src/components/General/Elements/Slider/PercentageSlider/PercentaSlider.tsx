import { usePriceStore } from '@/store/price/usepriceADAOrDollar';
import { formatMoney } from '@/utils/formats';
import React, { useEffect, useState } from 'react';
import styles from './PercentaSlider.module.scss';
import { usePercentaSlider } from "@/components/General/Elements/Slider/PercentageSlider/usePercentaSlider"

interface PercentageSliderProps {
    initialLabel: number; // Assuming you want to pass an initial value
    setValue: (value: bigint) => void;
    total: number

}

const PercentageSlider: React.FC<PercentageSliderProps> = ({ initialLabel, setValue, total }) => {

    const { label, setLabel, handleSliderChange } = usePercentaSlider(initialLabel, setValue, total);
    const { priceADAOrDollar } = usePriceStore();

    return (
        <div className={styles.labelContainer}>
            <input type="range" className={styles.slider} min={80} max={100} step={1} value={label} onChange={handleSliderChange} />
            <label className={styles.label}>{formatMoney(initialLabel, priceADAOrDollar == 'ada' ? 'ADA' : 'USD')}</label>
        </div>
    );
};

export default PercentageSlider;
