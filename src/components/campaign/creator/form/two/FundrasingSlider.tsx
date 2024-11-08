import React, { useState } from 'react';
import Slider from '@/components/general/slider/fundrasingSlider/Slider';
import styles from "./StepTwo.module.scss";
import { useCampaignStore } from '@/store/campaign/useCampaignStore';
import SelectButton from '@/components/buttons/selectButton/SelectButton';

interface FundrasingSliderProps {
    // Define props here
}

//! TODO Cambiar el h2 por un input para que el usuario pueda escribir el valor que desee


const FundrasingSlider: React.FC<FundrasingSliderProps> = (props) => {
    const { newCampaign, setGoal, setMilestones } = useCampaignStore();
    const goal = newCampaign.goal;
    const [selectedMilestones, setSelectedMilestones] = useState<number | null>(null);

    const handleSelect = (numMilestones: number) => {
        setSelectedMilestones(numMilestones);
        const milestones = Array.from({ length: numMilestones }, (_, index) => ({
            order: index + 1,
            goal: 0,
        }));
        setMilestones(milestones);
    };

    return (
        <div className={styles.layout}>
            <article className={styles.sliderContainer}>
                <div className={styles.sliderHeader}>
                    <h3>Fundraise goal</h3>
                    <h2>
                        ${goal.toLocaleString()}
                    </h2>
                </div>
                <Slider value={goal} setValue={setGoal} min={20000} max={150000} step={10000} />
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