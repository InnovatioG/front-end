import React from 'react';
import CommonsBtn from '@/components/UI/Buttons/CommonsBtn';
import { useCampaignStore } from '@/store/campaign/useCampaignStore';
import styles from './StepThree.module.scss';

interface StepThreeProps {
    // Define props aquí
}

const StepThree: React.FC<StepThreeProps> = (props) => {
    const { setBrandField, newCampaign, nextStep } = useCampaignStore();

    const formFields: { [key in "website" | "facebook" | "instagram" | "discord" | "twitter"]: string } = {
        website: newCampaign.website,
        facebook: newCampaign.facebook,
        instagram: newCampaign.instagram,
        discord: newCampaign.discord,
        twitter: newCampaign.twitter,
    };

    const disabledButton = () => {
        return !newCampaign.website;
    }


    return (
        <div className={styles.stepThreeLayout}>
            <h3>Insert your brand, project and community links</h3>
            <div className={styles.formContainer}>
                {Object.keys(formFields).map((key) => {
                    return (
                        <div key={key}>
                            <input
                                className={styles.input}
                                type="text"
                                id={key}
                                value={formFields[key as keyof typeof formFields]}
                                placeholder={key}
                                onChange={(e) => setBrandField(key as keyof typeof formFields, e.target.value)}
                            />
                        </div>
                    );
                })}
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