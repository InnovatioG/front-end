import { useEffect, useRef } from 'react';

interface UseSliderProps {
    value: bigint;
    min: bigint;
    max: bigint;
}

export const useSlider = ({ value, min, max }: UseSliderProps) => {
    const sliderRef = useRef<HTMLInputElement>(null);


    useEffect(() => {
        if (sliderRef.current) {
            const range = Number(max - min); // Calcular el rango como número
            const currentValue = Number(value - min); // Calcular el valor actual como número
            const percentage = (currentValue / range) * 100;

            sliderRef.current.style.setProperty('--value', `${percentage}%`);
        }
    }, [value, min, max]);

    return { sliderRef };
};

export default useSlider;
