import SelectButton from '@/components/General/Buttons/SelectButton/SelectButton';
import Slider from '@/components/General/Slider/Slider/Slider';
import ToolTipInformation from '@/components/General/ToolTipInformation/ToolTipInformation';
import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import { useGeneralStore } from '@/store/generalStore/useGeneralStore';
import { REQUESTED_MAX_ADA, REQUESTED_MIN_ADA } from '@/utils/constants/constants';
import React, { useMemo, useState } from 'react';
import styles from './FundrasingSlider.module.scss';

interface FundrasingSliderProps {
    handleSetNumOfMilestones: (numMilestones: number) => void;
    handleChangeRequestedMaxADA: (value: bigint) => void;
}

const FundrasingSlider: React.FC<FundrasingSliderProps & ICampaignIdStoreSafe> = (props: FundrasingSliderProps & ICampaignIdStoreSafe) => {
    const { campaign, handleSetNumOfMilestones, handleChangeRequestedMaxADA } = props;
    const { requestedMaxADA } = campaign.campaign;

    const milestones = useMemo(() => [...(campaign.milestones ?? [])].sort((a, b) => a.milestone.order - b.milestone.order), [campaign]);

    const { adaPrice, priceADAOrDollar } = useGeneralStore();

    const [selectedMilestones, setSelectedMilestones] = useState<number>(milestones?.length ?? 0);

    const calculaterequestedMaxADA = (requestedMaxADA: number, adaPrice: number) => {
        if (priceADAOrDollar == 'dollar') {
            return requestedMaxADA / adaPrice;
        }
        return requestedMaxADA;
    };

    return (
        <div className={styles.layout}>
            <article className={styles.sliderContainer}>
                <div className={styles.sliderHeader}>
                    <div className={styles.tooltipContainer}>
                        <ToolTipInformation
                            content={`The fundraising requestedMaxADA is the amount of money you want to raise with your campaign, configured in ₳. While you can use the dollar value as a reference, the actual amount in dollars may vary at the time of signing the smart contract. In today value is ₳${calculaterequestedMaxADA(
                                Number(requestedMaxADA),
                                adaPrice
                            ).toFixed(2)}`}
                        />
                    </div>
                    <h3>Fundraise Goal</h3>
                    <h2>
                        {priceADAOrDollar === 'ada' ? '₳' : '$'}
                        {requestedMaxADA.toLocaleString()}
                    </h2>
                </div>
                <Slider value={requestedMaxADA} setValue={(v) => handleChangeRequestedMaxADA(v)} min={REQUESTED_MIN_ADA} max={REQUESTED_MAX_ADA} step={1000} />
            </article>
            <article className={styles.buttonContainer}>
                {[1, 2, 3, 4, 5].map((num) => (
                    <SelectButton
                        key={num}
                        text={num.toString()}
                        onClick={() => {
                            handleSetNumOfMilestones(num);
                            setSelectedMilestones(num);
                        }}
                        selected={selectedMilestones === num}
                    />
                ))}
            </article>
        </div>
    );
};

export default FundrasingSlider;
