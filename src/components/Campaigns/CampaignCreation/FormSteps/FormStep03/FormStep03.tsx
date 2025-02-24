import React, { useEffect } from 'react';
import styles from './FormStep03.module.scss';
import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import { isNullOrBlank } from 'smart-db';
import CommonsBtn from '@/components/General/Buttons/CommonsBtn/CommonsBtn';
import { SocialLinksEnums } from '@/utils/constants/constants';

interface FormStep03Props {
    step: number;
    setStep: (step: number) => void;
}
const FormStep03: React.FC<FormStep03Props & ICampaignIdStoreSafe> = (props: FormStep03Props & ICampaignIdStoreSafe) => {
    const { campaign, setCampaignEX, setCampaign, step, setStep, isValidEdit, setIsValidEdit } = props;
    const { website } = campaign.campaign;

    useEffect(() => {
        let isValidEdit = false;
        if (!isNullOrBlank(website)) {
            isValidEdit = true;
        }
        setIsValidEdit(isValidEdit);
    }, [campaign]);

    const setSocial = (key: string, value: string) => {
        (campaign.campaign as any)[key] = value;
        setCampaign(campaign.campaign);
    };

    return (
        <div className={styles.stepThreeLayout}>
            <h3>Insert your brand, project and community links</h3>
            <div className={styles.formContainer}>
                {Object.values(SocialLinksEnums).map((social) => {
                    return (
                        <div key={social}>
                            <input
                                className={styles.input}
                                type="text"
                                id={social}
                                value={(campaign.campaign as any)[social] ?? ''}
                                placeholder={social}
                                onChange={(e) => setSocial(social, e.target.value)}
                            />
                        </div>
                    );
                })}
            </div>
            <div className={styles.btnActions}>
                <CommonsBtn type="primary" action={() => setStep(4)} content="Continue" disabled={!isValidEdit} />
            </div>
        </div>
    );
};

export default FormStep03;
