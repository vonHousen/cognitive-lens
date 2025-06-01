import styles from "@/styles/SOAPBlock.module.css";

export interface SOAPData {
  patientInfo: string; // General patient information
  S: string; // Subjective
  O: string; // Objective
  A: string; // Assessment
  P: string; // Plan
}

interface SOAPBlockProps {
  data: SOAPData;
}

const SOAPBlock = ({ data }: SOAPBlockProps) => {
  return (
    <div className={styles.soapContainer}>
      {/* Patient Information Section */}
      <div className={styles.patientInfo}>
        <div className={styles.patientInfoContent}>
          {data.patientInfo}
        </div>
      </div>
      
      {/* Horizontal divider */}
      <hr className={styles.divider} />
      
      {/* SOAP Elements */}
      <div className={styles.soapElements}>
        <div className={styles.soapItem}>
          <div className={styles.soapLabel}>Subjective:</div>
          <div className={styles.soapContent}>{data.S}</div>
        </div>
        <div className={styles.soapItem}>
          <div className={styles.soapLabel}>Objective:</div>
          <div className={styles.soapContent}>{data.O}</div>
        </div>
        <div className={styles.soapItem}>
          <div className={styles.soapLabel}>Assessment:</div>
          <div className={styles.soapContent}>{data.A}</div>
        </div>
        <div className={styles.soapItem}>
          <div className={styles.soapLabel}>Plan:</div>
          <div className={styles.soapContent}>{data.P}</div>
        </div>
      </div>
    </div>
  );
};

export default SOAPBlock; 