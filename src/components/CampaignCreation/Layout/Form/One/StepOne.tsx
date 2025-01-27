import CommonsBtn from '@/components/UI/Buttons/CommonsBtn';
import { useCampaignStore } from '@/store/campaign/useCampaignStore';
import CategoryDropdown from '@/components/CampaignCreation/Elements/CategoryDropdown/CategoryDropdown';
import styles from './StepOne.module.scss';
import useStepOne from '@/components/CampaignCreation/Layout/Form/One/useStepOne';
import { useEffect } from 'react';

export default function StepOne() {
    const { newCampaign, setTitle, setDescription, nextStep, setCategoryId, setDeadline } = useCampaignStore();
    const { name, description, campaing_category_id, deadline_days } = newCampaign;
    const { categoryOptions, handleDescriptionChange } = useStepOne();


    return (
        <div className={styles.section}>
            <div className={styles.articleGroup}>
                <div className={styles.article}>
                    <h2 className={styles.title}>Title</h2>
                    <div className={styles.inputGroup}>
                        <input className={styles.input} type="text" placeholder="Title of project" value={name} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                </div>

                <div className={styles.article}>
                    <h2 className={styles.title}>Category</h2>
                    <CategoryDropdown options={categoryOptions} value={campaing_category_id} onChange={(value) => setCategoryId(value.toString())} />
                </div>
            </div>

            <div className={styles.article}>
                <h2 className={styles.title}>Campaign days duration</h2>
                <div className={styles.inputGroup}>
                    <input
                        className={styles.input}
                        type="string"
                        placeholder="Campaign days duration"
                        value={deadline_days}
                        onChange={(e) => setDeadline(Number(e.target.value))}
                    />
                </div>
            </div>

            <div className={styles.article}>
                <h2 className={styles.title}>Description</h2>
                <div className={styles.areaGroup}>
                    <textarea
                        className={styles.textarea}
                        placeholder="Tell it as a brief description. Maximum 240 characters"
                        value={description}
                        onChange={handleDescriptionChange}
                    />
                    <div className={styles.characterCount}>{description.length}/240</div>
                </div>

            </div>
            <div className={styles.btnActions}>
                <CommonsBtn type="primary" action={() => nextStep()} content="Continue" disabled={name === '' || campaing_category_id === null || description === ''} />
            </div>
        </div>
    );
}
