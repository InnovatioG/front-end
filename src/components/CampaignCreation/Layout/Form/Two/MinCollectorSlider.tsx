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

    const porcentage = calculatePorcentage(Number(requestMaxAda), (Number(requestMinAda) * 100) / Number(requestMaxAda));
    console.log(requestMinAda)

    return (
        <div className={styles.minContainer}>
            <h3>Minimum collection to activate the campaign: {(Number(requestMinAda) * 100) / Number(requestMaxAda)}% </h3>
            <PercentageSlider initialLabel={porcentage} setValue={setRequestMinAda} total={Number(requestMaxAda)} />
        </div>
    );
}

export default MinCollectorSlider;  