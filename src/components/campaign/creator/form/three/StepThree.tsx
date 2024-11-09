import React from 'react';
import { useCampaignStore } from '@/store/campaign/useCampaignStore';

import styles from "./StepThree.module.scss";
import CommonsBtn from '@/components/buttons/CommonsBtn';
interface StepThreeProps {
    // Define props here
}





const StepThree: React.FC<StepThreeProps> = (props) => {
    const { setBrandField, newCampaign, nextStep } = useCampaignStore();
    const formFields = newCampaign.brand;

    const disabledButton = () => {
        return !newCampaign.brand.website
    }


    return (
        <div className={styles.stepThreeLayout}>
            <h3>Insert your brand, project and community links</h3>
            <div className={styles.formContainer}>
                {Object.keys(formFields).map((key) => {
                    return (
                        <div key={key} >
                            <input
                                className={styles.input}
                                type="text"
                                id={key}
                                value={formFields[key]}
                                placeholder={key}
                                onChange={(e) => setBrandField(key, e.target.value)}
                            />
                        </div>
                    );
                }
                )}
            </div>
            <div className={styles.btnActions}>
                <CommonsBtn
                    type="primary"
                    action={() => nextStep()}
                    content="Continue"
                    disabled={disabledButton()}
                />
            </div>

        </div>
    );
}

export default StepThree;