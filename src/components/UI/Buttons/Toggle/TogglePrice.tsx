import Toggle from '@/components/UI/Buttons/Toggle/Toggle';
import styles from '@/components/UI/Buttons/Toggle/Toggle.module.scss';
import { usePriceStore } from '@/store/price/usepriceAdaOrDollar';
import React, { useState } from 'react';

interface TogglePriceProps {
    // Define props here
}

const TogglePrice: React.FC<TogglePriceProps> = (props) => {
    const { priceAdaOrDollar, setPriceAdaOrDollar } = usePriceStore();
    const [isActive, setIsActive] = useState(priceAdaOrDollar === 'dollar');

    const handleClickToggle = () => {
        const newPrice = priceAdaOrDollar === 'ada' ? 'dollar' : 'ada';
        setIsActive(!isActive);
        setPriceAdaOrDollar(newPrice);
    };

    return (
        <div className={styles.toggleContainer}>
            <Toggle isActive={isActive} onClickToggle={handleClickToggle} disabled={false} />
            {isActive ? (
                <div>
                    <span className={styles.symbol}>$</span>
                    <span className={styles.symbolAdablack}>₳</span>
                </div>
            ) : (
                <div>
                    <span className={styles.symbolblack}>$</span>
                    <span className={styles.symbolAda}>₳</span>
                </div>
            )}
        </div>
    );
};

export default TogglePrice;
