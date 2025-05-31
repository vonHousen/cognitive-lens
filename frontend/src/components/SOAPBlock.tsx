import styles from "@/styles/SOAP.module.css";

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
          <div className={styles.soapLabel}>S:</div>
          <div className={styles.soapContent}>{data.S}</div>
        </div>
        <div className={styles.soapItem}>
          <div className={styles.soapLabel}>O:</div>
          <div className={styles.soapContent}>{data.O}</div>
        </div>
        <div className={styles.soapItem}>
          <div className={styles.soapLabel}>A:</div>
          <div className={styles.soapContent}>{data.A}</div>
        </div>
        <div className={styles.soapItem}>
          <div className={styles.soapLabel}>P:</div>
          <div className={styles.soapContent}>{data.P}</div>
        </div>
      </div>
    </div>
  );
};

export default SOAPBlock; 