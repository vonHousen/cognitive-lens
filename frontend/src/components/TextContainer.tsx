import styles from "@/styles/TextContainer.module.css";
import TextBlock from "./TextBlock";

interface TextContainerProps {
  textContents: string[];
}

const TextContainer = ({ textContents }: TextContainerProps) => {
  return (
    <div className={styles.textContainerWrapper}>
      {textContents.map((content, index) => (
        <TextBlock key={index} content={content} />
      ))}
    </div>
  );
};

export default TextContainer; 