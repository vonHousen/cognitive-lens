import styles from "@/styles/State.module.css";

interface StateBlockProps {
  contents: string[];
}

const StateBlock = ({ contents }: StateBlockProps) => {
  // Validate that we have between 2 and 5 items
  if (contents.length < 2 || contents.length > 5) {
    console.warn('StateBlock should have between 2 and 5 content items');
  }

  return (
    <div className={styles.stateContainer}>
      {contents.map((content, index) => (
        <div key={index} className={styles.stateItem}>
          <p>{content}</p>
        </div>
      ))}
    </div>
  );
};

export default StateBlock; 