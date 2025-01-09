import CategoryDropdown from "./CategoryDropdown";
import styles from "./StepOne.module.scss";
import CommonsBtn from "@/components/ui/buttons/CommonsBtn";
import { useCampaignStore } from "@/store/campaign/useCampaignStore";
import { useGeneralStore } from "@/store/generalConstants/useGeneralConstants";



export default function StepOne() {
  const { step, newCampaign, setTitle, setDescription, nextStep, setCategoryId } = useCampaignStore();
  const { name, description, campaing_category_id } = newCampaign;
  const { campaignCategories, campaignStatus } = useGeneralStore();





  const categoryOptions = campaignCategories.map((category) => ({
    value: category.id,
    label: category.name,
  }));



  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
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
            <input
              className={styles.input}
              type="text"
              placeholder="Title of project"
              value={name}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.article}>
          <h2 className={styles.title}>Category</h2>
          <CategoryDropdown
            options={categoryOptions}
            value={campaing_category_id}
            onChange={(value) => setCategoryId(value)}
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
        <CommonsBtn
          type="primary"
          action={() => nextStep()}
          content="Continue"
          disabled={name === "" || campaing_category_id === null || description === ""}
        />
      </div>

    </div>
  );
}
