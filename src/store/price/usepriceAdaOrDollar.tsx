import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface PriceState {
    priceAdaOrDollar: "dollar" | "ada";
}

interface PriceStore extends PriceState {
    setPriceAdaOrDollar: (price: "dollar" | "ada") => void;
}

export const usePriceStore = create<PriceStore>()(
    immer<PriceStore>((set) => ({
        priceAdaOrDollar: "dollar",
        setPriceAdaOrDollar: (price) =>
            set((state) => {
                state.priceAdaOrDollar = price;
            }),
    }))
);