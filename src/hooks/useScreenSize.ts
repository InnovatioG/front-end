import { useResponsiveContext } from '@/contexts/ResponsiveContext';

export const useScreenSize = () => {
    const { screenSize } = useResponsiveContext();
    return screenSize;
};
