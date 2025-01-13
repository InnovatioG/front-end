import { usePriceStore } from '@/store/price/usepriceAdaOrDollar';
import { formatMoney } from '@/utils/formats';
import React, { useEffect, useState } from 'react';
import styles from './PercentaSlider.module.scss';
import { usePercentaSlider } from "@/components/General/Elements/Slider/PercentageSlider/usePercentaSlider"

interface PercentageSliderProps {
    initialLabel: number; // Assuming you want to pass an initial value
    setValue: (value: BigInt) => void;
    total: number

}

const PercentageSlider: React.FC<PercentageSliderProps> = ({ initialLabel, setValue, total }) => {

    const { label, setLabel, handleSliderChange } = usePercentaSlider(initialLabel, setValue, total);
    const { priceAdaOrDollar } = usePriceStore();

    return (
        <div className={styles.labelContainer}>
            <input type="range" className={styles.slider} min={80} max={100} step={1} value={label} onChange={handleSliderChange} />
            <label className={styles.label}>{formatMoney(initialLabel, priceAdaOrDollar == 'ada' ? 'ADA' : 'USD')}</label>
        </div>
    );
};

export default PercentageSlider;
