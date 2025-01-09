import React, { useEffect, useState } from 'react';
import Slider from '@/components/General/elements/slider/fundrasingSlider/Slider';
import styles from "./StepTwo.module.scss";
import { useCampaignStore } from '@/store/campaign/useCampaignStore';
import SelectButton from '@/components/ui/buttons/selectButton/SelectButton';
import { usePriceStore } from '@/store/price/usepriceAdaOrDollar';
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
import ToolTipInformation from '@/components/General/elements/tooltipInformation/tooltipInformation';
interface FundrasingSliderProps {
    // Define props here
}

//! TODO Cambiar el h2 por un input para que el usuario pueda escribir el valor que desee


const FundrasingSlider: React.FC<FundrasingSliderProps> = (props) => {
    const { newCampaign, setRequestMaxAda, setMilestones } = useCampaignStore();
    const { fetchAdaPrice, price_ada } = useProjectDetailStore()
    const { priceAdaOrDollar } = usePriceStore();

    useEffect(() => {
        fetchAdaPrice()
    }, [])



    const requestMaxAda = newCampaign.requestMaxAda;
    const [selectedMilestones, setSelectedMilestones] = useState<number | null>(null);

    const handleSelect = (numMilestones: number) => {
        setSelectedMilestones(numMilestones);
        const milestones = Array.from({ length: numMilestones }, (_, index) => ({
            order: index + 1,
            requestMaxAda: 0,
        }));
        setMilestones(milestones);
    };


    const calculaterequestMaxAda = (requestMaxAda: number, price_ada: number) => {
        if (priceAdaOrDollar == "dollar") {
            return requestMaxAda / price_ada;
        }
        return requestMaxAda;
    }



    return (
        <div className={styles.layout}>
            <article className={styles.sliderContainer}>
                <div className={styles.sliderHeader}>
                    <div className={styles.tooltipContainer}>
                        <ToolTipInformation
                            content={`The fundraising requestMaxAda is the amount of money you want to raise with your campaign, configured in ₳. While you can use the dollar value as a reference, the actual amount in dollars may vary at the time of signing the smart contract. In today value is ₳${calculaterequestMaxAda(Number(requestMaxAda), price_ada).toFixed(2)}`}
                        />
                    </div>
                    <h3>Fundraise requestMaxAda</h3>
                    <h2>
                        {priceAdaOrDollar === "ada" ? "₳" : "$"}
                        {requestMaxAda.toLocaleString()}
                    </h2>
                </div>
                <Slider value={requestMaxAda} setValue={setRequestMaxAda} min={20000n} max={150000n} step={10000} />
            </article>
            <article className={styles.buttonContainer}>
                {[1, 2, 3, 4, 5].map((num) => (
                    <SelectButton
                        key={num}
                        text={num.toString()}
                        onClick={() => handleSelect(num)}
                        selected={selectedMilestones === num}
                    />
                ))}
            </article>

        </div>
    );
};

export default FundrasingSlider;