import styles from "./Btns.module.scss";

interface BtnProps {
  type: "primary" | "secondary";
  width?: number;
  action: () => void;
  content: string;
  disabled?: boolean;
}

interface SubBtnProps {
  width?: number;
  action: () => void;
  content: string;
  disabled?: boolean;
}

const BtnPrimary: React.FC<SubBtnProps> = (props: SubBtnProps) => {
  const { width, action, content, disabled } = props;
  return (
    <div
      className={`${styles.BtnPrimary} ${disabled ? styles.disabled : ""}`}
      style={width ? { width: `${width}px` } : undefined}
      onClick={disabled ? undefined : action}
    >
      <p className={styles.text}>{content}</p>
    </div>
  );
};

const BtnSecondary: React.FC<SubBtnProps> = (props: SubBtnProps) => {
  const { width, action, content, disabled } = props;
  return (
    <div
      className={`${styles.btnSecondary} ${disabled ? styles.disabled : ""}`}
      style={width ? { width: `${width}px` } : undefined}
      onClick={action}
    >
      <p className={styles.text}>{content}</p>
    </div>
  );
};

const CommonsBtn: React.FC<BtnProps> = (props: BtnProps) => {
  const { type, width, action, content, disabled } = props;
  switch (type) {
    case "primary":
      return <BtnPrimary width={width} action={action} content={content} disabled={disabled}/>;
    case "secondary":
      return <BtnSecondary width={width} action={action} content={content} disabled={disabled}/>;
    default:
      return null;
  }
};

export default CommonsBtn;
