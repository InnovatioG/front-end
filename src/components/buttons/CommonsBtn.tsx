import styles from "./Btns.module.scss";

interface BtnProps {
  type: "primary" | "secondary";
  width?: number;
  action: () => void;
  content: string;
}

interface SubBtnProps {
  width?: number;
  action: () => void;
  content: string;
}

const BtnPrimary: React.FC<SubBtnProps> = (props: SubBtnProps) => {
  const { width, action, content } = props;
  return (
    <div
      className={styles.BtnPrimary}
      style={width ? { width: `${width}px` } : undefined}
      onClick={action}
    >
      <p className={styles.text}>{content}</p>
    </div>
  );
};

const BtnSecondary: React.FC<SubBtnProps> = (props: SubBtnProps) => {
  const { width, action, content } = props;
  return (
    <div
      className={styles.btnSecondary}
      style={width ? { width: `${width}px` } : undefined}
      onClick={action}
    >
      <p className={styles.text}>{content}</p>
    </div>
  );
};

const CommonsBtn: React.FC<BtnProps> = (props: BtnProps) => {
  const { type, width, action, content } = props;
  switch (type) {
    case "primary":
      return <BtnPrimary width={width} action={action} content={content}/>;
    case "secondary":
      return <BtnSecondary width={width} action={action} content={content}/>;
    default:
      return null;
  }
};

export default CommonsBtn;
