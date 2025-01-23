import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface PriceState {
    priceADAOrDollar: 'dollar' | 'ada';
}

interface PriceStore extends PriceState {
    setPriceADAOrDollar: (price: 'dollar' | 'ada') => void;
}

export const usePriceStore = create<PriceStore>()(
    immer<PriceStore>((set) => ({
        priceADAOrDollar: 'dollar',
        setPriceADAOrDollar: (price) =>
            set((state) => {
                state.priceADAOrDollar = price;
            }),
    }))
);
