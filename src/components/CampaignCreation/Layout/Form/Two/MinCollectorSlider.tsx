import React from 'react';
import styles from "./MinCollector.module.scss"
import { useCampaignStore } from '@/store/campaign/useCampaignStore';
import { calculatePorcentage } from '@/utils/formats';
import PercentageSlider from '@/components/General/Elements/Slider/PercentageSlider/PercentaSlider';
interface MinCollectorSliderProps {
    // Define props here
}

const MinCollectorSlider: React.FC<MinCollectorSliderProps> = (props) => {

    const { setRequestMinAda, newCampaign } = useCampaignStore();
    const { requestMinAda, requestMaxAda, } = newCampaign;



    const min_request = newCampaign.requestMinAda;
    const porcentage = calculatePorcentage(Number(requestMaxAda), Number(requestMinAda));

    return (
        <div className={styles.minContainer}>
            <h3>Minimum collection to activate the campaign: {Number(requestMinAda)}% </h3>
            <PercentageSlider initialLabel={porcentage} setValue={setRequestMinAda} />
        </div>
    );
}

export default MinCollectorSlider;  