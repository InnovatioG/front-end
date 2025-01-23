import React from 'react';
import styles from "./MinCollector.module.scss"
import { useCampaignStore } from '@/store/campaign/useCampaignStore';
import { calculatePorcentage } from '@/utils/formats';
import PercentageSlider from '@/components/General/Elements/Slider/PercentageSlider/PercentaSlider';
interface MinCollectorSliderProps {
    // Define props here
}

const MinCollectorSlider: React.FC<MinCollectorSliderProps> = (props) => {

    const { setRequestMinADA, newCampaign } = useCampaignStore();
    const { requestMinADA, requestMaxADA, } = newCampaign;

    const porcentage = calculatePorcentage(Number(requestMaxADA), (Number(requestMinADA) * 100) / Number(requestMaxADA));
    console.log(requestMinADA)

    return (
        <div className={styles.minContainer}>
            <h3>Minimum collection to activate the campaign: {(Number(requestMinADA) * 100) / Number(requestMaxADA)}% </h3>
            <PercentageSlider initialLabel={porcentage} setValue={setRequestMinADA} total={Number(requestMaxADA)} />
        </div>
    );
}

export default MinCollectorSlider;  