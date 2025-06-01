import styles from "@/styles/ThinkingContainer.module.css";

export interface ThinkingStep {
  role: string;
  content: string;
  structured_data?: Record<string, any>;
  decision?: boolean;
}

export interface ThinkingProcessData {
  steps: ThinkingStep[];
}

interface ThinkingContainerProps {
  data: ThinkingProcessData;
}

const ThinkingContainer = ({ data }: ThinkingContainerProps) => {
  const mapRoleName = (role: string): string => {
    switch (role) {
      case "EXECUTOR":
        return "THERAPIST";
      case "JUDGE":
        return "JURY";
      case "SUPERVISOR":
        return "JUDGE";
      default:
        return role;
    }
  };

  const parseStepContent = (step: ThinkingStep) => {
    if (step.role === "EXECUTOR" && step.structured_data) {
      return (
        <div className={styles.structuredOutput}>
          <div className={styles.therapistMessage}>
            <strong>Message to Patient:</strong>
            <div className={styles.messageContent}>
              {step.structured_data.respond_to_patient || step.content}
            </div>
          </div>
          
          {(step.structured_data.updated_general_info || 
            step.structured_data.updated_subjective || 
            step.structured_data.updated_objective || 
            step.structured_data.updated_assessment || 
            step.structured_data.updated_plan) && (
            <div className={styles.soapUpdates}>
              <strong>SOAP Updates:</strong>
              {step.structured_data.updated_general_info && (
                <div className={styles.soapSection}>
                  <span className={styles.soapLabel}>General Info:</span>
                  <div className={styles.soapContent}>{step.structured_data.updated_general_info}</div>
                </div>
              )}
              {step.structured_data.updated_subjective && (
                <div className={styles.soapSection}>
                  <span className={styles.soapLabel}>Subjective:</span>
                  <div className={styles.soapContent}>{step.structured_data.updated_subjective}</div>
                </div>
              )}
              {step.structured_data.updated_objective && (
                <div className={styles.soapSection}>
                  <span className={styles.soapLabel}>Objective:</span>
                  <div className={styles.soapContent}>{step.structured_data.updated_objective}</div>
                </div>
              )}
              {step.structured_data.updated_assessment && (
                <div className={styles.soapSection}>
                  <span className={styles.soapLabel}>Assessment:</span>
                  <div className={styles.soapContent}>{step.structured_data.updated_assessment}</div>
                </div>
              )}
              {step.structured_data.updated_plan && (
                <div className={styles.soapSection}>
                  <span className={styles.soapLabel}>Plan:</span>
                  <div className={styles.soapContent}>{step.structured_data.updated_plan}</div>
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    if (step.role === "JUDGE" && step.structured_data) {
      const decision = step.decision;
      return (
        <div className={styles.juryDecision}>
          <div className={`${styles.decisionIndicator} ${decision ? styles.approved : styles.rejected}`}>
            {decision ? '✓ APPROVED' : '✗ REJECTED'}
          </div>
          <div className={styles.feedback}>
            {step.structured_data.feedback || step.content}
          </div>
        </div>
      );
    }

    if (step.role === "SUPERVISOR" && step.structured_data) {
      const decision = step.decision;
      return (
        <div className={styles.supervisorDecision}>
          <div className={`${styles.decisionIndicator} ${decision ? styles.approved : styles.rejected}`}>
            {decision ? '✓ RESPONSE VALID' : '✗ NEEDS REVISION'}
          </div>
          <div className={styles.feedback}>
            {step.structured_data.feedback || step.content}
          </div>
        </div>
      );
    }

    try {
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
      return step.content;
    }
  };

  const groupSteps = (steps: ThinkingStep[]) => {
    const groups: Array<{type: 'single', step: ThinkingStep} | {type: 'jury', steps: ThinkingStep[]}> = [];
    let currentJuryGroup: ThinkingStep[] = [];
    
    for (const step of steps) {
      if (step.role === "JUDGE") {
        currentJuryGroup.push(step);
      } else {
        if (currentJuryGroup.length > 0) {
          groups.push({type: 'jury', steps: currentJuryGroup});
          currentJuryGroup = [];
        }
        groups.push({type: 'single', step});
      }
    }
    
    if (currentJuryGroup.length > 0) {
      groups.push({type: 'jury', steps: currentJuryGroup});
    }
    
    return groups;
  };

  const groupedSteps = groupSteps(data.steps);

  return (
    <div className={styles.thinkingContainer}>
      <div className={styles.thinkingHeader}>
        <h3 className={styles.thinkingTitle}>Evaluation Process</h3>
      </div>
      
      <hr className={styles.divider} />
      
      <div className={styles.thinkingSteps}>
        {groupedSteps.length > 0 ? (
          groupedSteps.map((group, index) => {
            if (group.type === 'single') {
              return (
                <div key={index} className={styles.thinkingItem}>
                  <div className={styles.roleLabel}>{mapRoleName(group.step.role)}:</div>
                  <div className={styles.stepContent}>
                    {parseStepContent(group.step)}
                  </div>
                </div>
              );
            } else {
              return (
                <div key={index} className={styles.juryContainer}>
                  <div className={styles.roleLabel}>JURY:</div>
                  <div className={styles.juryColumns}>
                    {group.steps.map((step, juryIndex) => (
                      <div key={juryIndex} className={styles.juryColumn}>
                        <div className={styles.juryMemberHeader}>Member {juryIndex + 1}</div>
                        <div className={styles.stepContent}>
                          {parseStepContent(step)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
          })
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