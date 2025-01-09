import React, { useEffect, useRef } from 'react';
import styles from './Slider.module.scss';

interface SliderProps {
    value: BigInt;
    setValue: (value: BigInt) => void;
    min: BigInt;
    max: BigInt;
    step: number;
}

const Slider: React.FC<SliderProps> = ({ value, setValue, min, max, step }) => {
    const sliderRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (sliderRef.current) {
            // Calcula el porcentaje basado en BigInt
            const range = Number(max) - Number(min);
            const currentValue = Number(value) - Number(min);
            const percentage = (currentValue / range) * 100;

            // Actualiza la propiedad personalizada de CSS
            sliderRef.current.style.setProperty('--value', `${percentage}%`);
        }
    }, [value, min, max]);

    return (
        <div className={styles.sliderWrapper}>
            <input
                ref={sliderRef}
                type="range"
                min={min.toString()} // Convierte BigInt a string para que HTML lo acepte
                max={max.toString()}
                step={step}
                value={value.toString()}
                onChange={(e) => setValue(BigInt(e.target.value))} // Convierte a BigInt al actualizar
                className={`${styles.slider} ${styles['slider-filled']}`} // Aplica estilos
            />
        </div>
    );
};

export default Slider;
