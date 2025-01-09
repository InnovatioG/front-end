import CommonsBtn from '@/components/UI/Buttons/CommonsBtn';
import { useCampaignStore } from '@/store/campaign/useCampaignStore';
import { categories } from '@/utils/constants';
import CategoryDropdown from './CategoryDropdown';
import styles from './StepOne.module.scss';

export default function StepOne() {
    const { step, name, setTitle, category, setCategory, setDescription, nextStep, description } = useCampaignStore();

    const categoryOptions = categories.map((category) => ({
        value: category,
        label: category,
    }));

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        if (value.length <= 240) {
            setDescription(value);
        }
    };
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
                    <CategoryDropdown options={categoryOptions} value={category} onChange={(value) => setCategory(value)} />
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
                <CommonsBtn type="primary" action={() => nextStep()} content="Continue" disabled={name === '' || category === '' || description === ''} />
            </div>
        </div>
    );
}
