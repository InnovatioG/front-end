import React, { useEffect } from 'react';
import Slider from '@/components/General/Elements/Slider/FundrasingSlider/Slider';
import styles from './StepTwo.module.scss';
import { useCampaignStore } from '@/store/campaign/useCampaignStore';
import SelectButton from '@/components/UI/Buttons/SelectButton/SelectButton';
import { usePriceStore } from '@/store/price/usepriceADAOrDollar';
import ToolTipInformation from '@/components/General/Elements/TooltipInformation/tooltipInformation';
import { useGeneralStore } from '@/store/generalConstants/useGeneralConstants';
import useFundraisingSlider from '@/components/CampaignCreation/Layout/Form/Two/useFundraisingSlider';

const FundrasingSlider: React.FC = (props) => {
    const { adaPrice } = useGeneralStore();
    const { priceADAOrDollar } = usePriceStore();
    const { selectedMilestones, handleSelect, calculaterequestMaxADA, requestMaxADA, requestMinADA, setRequestMaxADA } = useFundraisingSlider();



    return (
        <div className={styles.layout}>
            <article className={styles.sliderContainer}>
                <div className={styles.sliderHeader}>
                    <div className={styles.tooltipContainer}>
                        <ToolTipInformation
                            content={`The fundraising requestMaxADA is the amount of money you want to raise with your campaign, configured in ₳. While you can use the dollar value as a reference, the actual amount in dollars may vary at the time of signing the smart contract. In today value is ₳${calculaterequestMaxADA(
                                Number(requestMaxADA),
                                adaPrice
                            ).toFixed(2)}`}
                        />
                    </div>
                    <h3>Fundraise Goal</h3>
                    <h2>
                        {priceADAOrDollar === 'ada' ? '₳' : '$'}
                        {requestMaxADA.toLocaleString()}
                    </h2>
                </div>
                <Slider value={requestMaxADA} setValue={setRequestMaxADA} min={20000n} max={150000n} step={10000} />
            </article>
            <article className={styles.buttonContainer}>
                {[1, 2, 3, 4, 5].map((num) => (
                    <SelectButton key={num} text={num.toString()} onClick={() => handleSelect(num)} selected={selectedMilestones === num} />
                ))}
            </article>
        </div>
    );
};

export default FundrasingSlider;