import CommonsBtn from '@/components/General/Buttons/CommonsBtn/CommonsBtn';
import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import { useGeneralStore } from '@/store/generalStore/useGeneralStore';
import { useEffect } from 'react';
import { isNullOrBlank } from 'smart-db';
import CategoryDropdown from './CategoryDropdown/CategoryDropdown';
import styles from './FormStep01.module.scss';

interface FormStep01Props {
    step: number;
    setStep: (step: number) => void;
}

const FormStep01: React.FC<FormStep01Props & ICampaignIdStoreSafe> = (props: FormStep01Props & ICampaignIdStoreSafe) => {
    const { campaign, setCampaignEX, setCampaign, step, setStep, isValidEdit, setIsValidEdit } = props;
    const { name, description, campaign_category_id, deadline_days } = campaign.campaign;

    const { campaignStatus, campaignCategories, wallet, setPriceADAOrDollar } = useGeneralStore();

    const categoryOptions = campaignCategories.map((category) => ({
        value: category._DB_id,
        label: category.name,
    }));

    useEffect(() => {
        setPriceADAOrDollar('ada');
    }, []);

    useEffect(() => {
        let isValidEdit = false;
        if (
            !isNullOrBlank(name) &&
            !isNullOrBlank(description) &&
            (description?.length ?? 0) <= 240 &&
            campaign_category_id !== null &&
            !isNullOrBlank(campaign_category_id) &&
            (deadline_days ?? 0) > 0 &&
            (deadline_days ?? 0) <= 365
        ) {
            isValidEdit = true;
        }
        setIsValidEdit(isValidEdit);
    }, [campaign.campaign]);

    const setCategoryId = (value: string) => {
        campaign.campaign.campaign_category_id = value;
        setCampaign(campaign.campaign);
    };

    const setTitle = (value: string) => {
        campaign.campaign.name = value;
        setCampaign(campaign.campaign);
    };

    const setDescription = (value: string) => {
        campaign.campaign.description = value;
        setCampaign(campaign.campaign);
    };

    const setDeadline = (value: number) => {
        campaign.campaign.deadline_days = value;
        setCampaign(campaign.campaign);
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
                    <CategoryDropdown options={categoryOptions} value={campaign_category_id} onChange={(value) => setCategoryId(value)} />
                </div>
            </div>

            <div className={styles.article}>
                <h2 className={styles.title}>Campaign days duration</h2>
                <div className={styles.inputGroup}>
                    <input
                        className={styles.input}
                        type="number"
                        min={0}
                        max={365}
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
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <div className={styles.characterCount}>{description?.length ?? 0}/240</div>
                </div>
            </div>
            <div className={styles.btnActions}>
                <CommonsBtn type="primary" action={() => setStep(2)} content="Continue" disabled={!isValidEdit} />
            </div>
        </div>
    );
};

export default FormStep01;
