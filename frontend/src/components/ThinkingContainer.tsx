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

  const parseStepContent = (content: string) => {
    try {
      const parsed = JSON.parse(content);
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
      return content;
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
                    {parseStepContent(group.step.content)}
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
                          {parseStepContent(step.content)}
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