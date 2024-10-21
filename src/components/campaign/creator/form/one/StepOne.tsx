import { categories } from "@/utils/constants";
import CategoryDropdown from "./CategoryDropdown";
import styles from "./StepOne.module.scss";
import CommonsBtn from "@/components/buttons/CommonsBtn";

interface StepOneProps {
  title: string;
  setTitle: (title: string) => void;
  category: string;
  setCategory: (category: string) => void;
  description: string;
  setDescription: (description: string) => void;
  handleContinue: (step: 1 | 2 | 3 | 4) => void;
}

export default function StepOne(props: StepOneProps) {
  const {
    title,
    setTitle,
    category,
    setCategory,
    description,
    setDescription,
    handleContinue,
  } = props;
  const categoryOptions = categories.map((category) => ({
    value: category,
    label: category,
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.article}>
          <h2 className={styles.title}>Category</h2>
          <CategoryDropdown
            options={categoryOptions}
            value={category}
            onChange={(value) => setCategory(value)}
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
        action={() => handleContinue(2)}
        content="Continue"
        disabled={title === "" || category === "" || description === ""}
      />
      </div>
      
    </div>
  );
}
