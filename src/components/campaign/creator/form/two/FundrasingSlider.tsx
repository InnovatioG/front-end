import React from 'react';
import Slider from '@/components/general/slider/fundrasingSlider/FundrasingSlider';
interface FundrasingSliderProps {
    // Define props here
}

const FundrasingSlider: React.FC<FundrasingSliderProps> = (props) => {
    return (
        <div>
            aca va el slider general
            <Slider />
        </div>
    );
}

export default FundrasingSlider;