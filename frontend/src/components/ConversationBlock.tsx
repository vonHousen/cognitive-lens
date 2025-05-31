import styles from "@/styles/Conversation.module.css";
import { Message } from "@/utils/constants";

interface ConversationBlockProps {
  messages: Message[];
}

const ConversationBlock = ({ messages }: ConversationBlockProps) => {
  return (
    <div className={styles.conversationContainer}>
      <div className={styles.conversation}>
        {messages.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No messages yet. Start a conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`${styles.message} ${
                message.role === 'user' ? styles.userMessage : styles.assistantMessage
              }`}
            >
              <div className={styles.messageHeader}>
                <span className={styles.role}>
                  {message.role === 'user' ? '👤 You' : '🤖 Assistant'}
                </span>
                {message.timestamp && (
                  <span className={styles.timestamp}>
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                )}
              </div>
              <div className={styles.messageContent}>
                <p>{message.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationBlock; 