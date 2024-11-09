import React from 'react';
import styles from "./MinCollector.module.scss"
import { useCampaignStore } from '@/store/campaign/useCampaignStore';
import { calculatePorcentage } from '@/utils/formats';
import PercentageSlider from '@/components/general/slider/percentageSlider/PercentaSlider';
interface MinCollectorSliderProps {
    // Define props here
}

const MinCollectorSlider: React.FC<MinCollectorSliderProps> = (props) => {

    const { setMinRequest, newCampaign } = useCampaignStore();

    const min_request = newCampaign.min_request;
    const goal = newCampaign.goal;
    const porcentage = calculatePorcentage(goal, min_request);

    return (
        <div className={styles.minContainer}>
            <h3>Minimum collection to activate the campaign: {min_request}% </h3>
            <PercentageSlider initialLabel={porcentage} setValue={setMinRequest} />
        </div>
    );
}

export default MinCollectorSlider;  