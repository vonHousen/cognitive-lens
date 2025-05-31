import styles from "@/styles/State.module.css";
import SOAPBlock, { SOAPData } from "./SOAPBlock";

interface StateBlockProps {
  soapData: SOAPData;
}

const StateBlock = ({ soapData }: StateBlockProps) => {
  return (
    <div className={styles.stateContainer}>
      <div className={styles.stateItem}>
        <SOAPBlock data={soapData} />
      </div>
    </div>
  );
};

export default StateBlock; 