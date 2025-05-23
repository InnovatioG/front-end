import Toggle from '@/components/General/Buttons/Toggle/Toggle';
import styles from '@/components/General/Buttons/Toggle/Toggle.module.scss';
import { useGeneralStore } from '@/store/generalStore/useGeneralStore';
import React, { useState } from 'react';

interface TogglePriceProps {
    // Define props here
}

const TogglePrice: React.FC<TogglePriceProps> = (props) => {
    const { priceADAOrDollar, setPriceADAOrDollar } = useGeneralStore();
    const [isActive, setIsActive] = useState(priceADAOrDollar === 'dollar');

    const handleClickToggle = () => {
        const newPrice = priceADAOrDollar === 'ada' ? 'dollar' : 'ada';
        setIsActive(!isActive);
        setPriceADAOrDollar(newPrice);
    };

    return (
        <div className={styles.toggleContainer}>
            <Toggle isActive={isActive} onClickToggle={handleClickToggle} disabled={false} />
            {isActive ? (
                <div>
                    <span className={styles.symbol}>$</span>
                    <span className={styles.symbolADAblack}>₳</span>
                </div>
            ) : (
                <div>
                    <span className={styles.symbolblack}>$</span>
                    <span className={styles.symbolADA}>₳</span>
                </div>
            )}
        </div>
    );
};

export default TogglePrice;
