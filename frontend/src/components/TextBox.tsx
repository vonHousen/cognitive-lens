import styles from "@/styles/Boxes.module.css";

interface TextBoxProps {
  text: string;
}

const TextBox = ({ text }: TextBoxProps) => {
    return (
        <div className={styles.box}>
            <p>{text}</p>
        </div>
    );
}

export default TextBox;

