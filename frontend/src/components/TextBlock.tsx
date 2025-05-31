import styles from "@/styles/TextBlock.module.css";

interface TextBlockProps {
  content: string;
}

const TextBlock = ({ content }: TextBlockProps) => {
  return (
    <div className={styles.textContainer}>
      <p>{content}</p>
    </div>
  );
};

export default TextBlock; 