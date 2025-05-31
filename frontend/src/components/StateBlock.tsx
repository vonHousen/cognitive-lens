import styles from "@/styles/State.module.css";
import SOAPBlock, { SOAPData } from "./SOAPBlock";

export interface StateContent {
  type: 'soap' | 'text';
  content: SOAPData | string;
}

interface StateBlockProps {
  contents: StateContent[];
}

const StateBlock = ({ contents }: StateBlockProps) => {
  // Validate that we have exactly 3 items
  if (contents.length !== 3) {
    console.warn('StateBlock should have exactly 3 content items');
  }

  return (
    <div className={styles.stateContainer}>
      {contents.map((item, index) => (
        <div key={index} className={styles.stateItem}>
          {item.type === 'soap' ? (
            <SOAPBlock data={item.content as SOAPData} />
          ) : (
            <p>{item.content as string}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default StateBlock; 