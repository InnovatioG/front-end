import PercentageSlider from '@/components/General/Slider/PercentageSlider/PercentaSlider';
import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import { REQUESTED_MIN_PERCENTAGE_FROM_MAX } from '@/utils/constants/constants';
import React, { useEffect, useState } from 'react';
import styles from './MinCollectorSlider.module.scss';

interface MinCollectorSliderProps {
    handleChangeRequestedMinADA: (value: bigint) => void;
}

const MinCollectorSlider: React.FC<MinCollectorSliderProps & ICampaignIdStoreSafe> = (props) => {
    const { campaign, handleChangeRequestedMinADA } = props;
    const { requestedMaxADA, requestedMinADA } = campaign.campaign;

    // Set initial percentage
    const [percentage, setPercentage] = useState<number>(requestedMaxADA > 0 ? (Number(requestedMinADA) * 100) / Number(requestedMaxADA) : 80);

    // Min and max values for the slider (80% - 90% of requestedMaxADA)
    const minADA = Math.floor(Number(requestedMaxADA) * REQUESTED_MIN_PERCENTAGE_FROM_MAX);
    const maxADA = Math.floor(Number(requestedMaxADA));

    // Ensure requestedMinADA is always within the valid range
    useEffect(() => {
        if (Number(requestedMinADA) < minADA) {
            handleChangeRequestedMinADA(BigInt(minADA));
        }
        if (Number(requestedMinADA) > maxADA) {
            handleChangeRequestedMinADA(BigInt(maxADA));
        }
        if (requestedMaxADA > 0) {
            setPercentage((Number(requestedMinADA) * 100) / Number(requestedMaxADA));
        }
    }, [requestedMaxADA, requestedMinADA]);

    return (
        <div className={styles.minContainer}>
            <h3>Minimum collection to activate the campaign: {percentage.toFixed(2)}%</h3>
            <PercentageSlider value={Number(requestedMinADA)} setValue={(v) => handleChangeRequestedMinADA(BigInt(v))} total={maxADA} />
        </div>
    );
};

export default MinCollectorSlider;
