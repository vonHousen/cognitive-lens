import styles from "@/styles/ThinkingContainer.module.css";

export interface ThinkingStep {
  role: string;
  content: string;
}

export interface ThinkingProcessData {
  steps: ThinkingStep[];
}

interface ThinkingContainerProps {
  data: ThinkingProcessData;
}

const ThinkingContainer = ({ data }: ThinkingContainerProps) => {
  return (
    <div className={styles.thinkingContainer}>
      <div className={styles.thinkingHeader}>
        <h3 className={styles.thinkingTitle}>Thinking Process</h3>
      </div>
      
      <hr className={styles.divider} />
      
      <div className={styles.thinkingSteps}>
        {data.steps.length > 0 ? (
          data.steps.map((step, index) => (
            <div key={index} className={styles.thinkingItem}>
              <div className={styles.roleLabel}>{step.role}:</div>
              <div className={styles.stepContent}>
                {(() => {
                  try {
                    // Try to parse content as JSON and extract meaningful text
                    const parsed = JSON.parse(step.content);
                    if (parsed.respond_to_patient) {
                      return parsed.respond_to_patient;
                    } else if (parsed.feedback) {
                      return parsed.feedback;
                    } else if (parsed.is_task_done_properly !== undefined) {
                      return `Task completed: ${parsed.is_task_done_properly ? 'Yes' : 'No'}${parsed.feedback ? ` - ${parsed.feedback}` : ''}`;
                    } else {
                      return JSON.stringify(parsed, null, 2);
                    }
                  } catch (e) {
                    // If not JSON, return as is
                    return step.content;
                  }
                })()}
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            No thinking process available yet...
          </div>
        )}
      </div>
    </div>
  );
};

export default ThinkingContainer; 