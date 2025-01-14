import TextEditor from '@/components/General/Elements/TextEditor/TextEditor';
import React from 'react';
import AdminUTXOS from '@/components/CampaignCreation/Elements/AdminUTXO/AdminUTXO';
import styles from './Tokenomics.module.scss';
import useTokenomics from './useTokenomics';
const Tokenomics: React.FC = () => {
    const { fields, handleInputChange, setCampaign, campaign } = useTokenomics();
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
                 */}{' '}
            </div>

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
