import TextEditor from '@/components/General/Elements/TextEditor/TextEditor';
import { useCampaignIdStore } from '@/store/campaignId/useCampaignIdStore';
import { inputFieldsToken } from '@/utils/constants';
import React from 'react';
import AdminUTXOS from './adminUTXO';
import styles from './Tokenomics.module.scss';
import { useGeneralStore } from '@/store/generalConstants/useGeneralConstants';
const Tokenomics: React.FC = () => {
    const { campaign, setCampaign } = useCampaignIdStore();
    const { adaPrice } = useGeneralStore();

    const handleInputChange = (id: string, value: string, transform: (value: string) => any) => {
        setCampaign({
            ...campaign,
            [id]: transform(value),
        });
    };

    const fields = inputFieldsToken(campaign);

    /*     const valuePerToken =
            campaign.requestMaxAda === null || isNaN(campaign.requestMaxAda) ? (
                'Price per token'
            ) : (
                <div className={styles.priceInAda}>
                    <img src={'/img/icons/ADA.svg'} alt="ADA" height={12} width={12} />
                    <span>{(campaign.requestMaxAda / project.cdRequestedMaxADA / adaPrice).toFixed(2)}</span>
                </div>
            ); */

    return (
        <div className={styles.layout}>
            <h2 className={styles.title}>Explain your tokenomics, quantity and value</h2>
            <div className={styles.formContainer}>
                {fields.map((field, index) => (
                    <div key={field.id} className={`${styles.singleInputContainer} ${index === 0 ? styles.fullWidth : ''}`}>
                        <label className={styles.label}>{field.label}</label>
                        <input
                            className={styles.input}
                            type={field.type}
                            value={field.value}
                            placeholder={field.placeholder}
                            onChange={(e) => handleInputChange(field.id, e.target.value, field.transform)}
                        />
                    </div>
                ))}
            </div>
            <div className={styles.inputTokenContainer}>
                {/*                 <div className={styles.inputToken}>{valuePerToken}</div>
 */}            </div>

            <br />

            <div className={styles.textEditorContainer}>
                <TextEditor
                    styleOption="quillEditorB"
                    content={campaign.tokenomics_description || ''}
                    onChange={(content) => handleInputChange('tokenomics_description', content, (value) => value)}
                />
            </div>

            <div className={styles.editUTXO}>
                <AdminUTXOS />
            </div>
        </div>
    );
};

export default Tokenomics;
