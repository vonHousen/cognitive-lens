import { useState, useEffect, useRef } from "react";
import styles from "@/styles/Conversation.module.css";
import { Message } from "@/utils/constants";

interface ConversationBlockProps {
  messages: Message[];
  onAddMessage?: (content: string) => void;
}

const ConversationBlock = ({ messages, onAddMessage }: ConversationBlockProps) => {
  const [inputValue, setInputValue] = useState("");
  const conversationRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (conversationRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = conversationRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100; // Within 100px of bottom
      
      // Auto-scroll if user is already near the bottom or if this is a new message
      if (isNearBottom || messages.length > 0) {
        conversationRef.current.scrollTo({
          top: scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && onAddMessage) {
      onAddMessage(inputValue.trim());
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={styles.conversationContainer}>
      <div 
        ref={conversationRef}
        className={styles.conversation}
      >
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
      
      <div className={styles.inputContainer}>
        <form onSubmit={handleSubmit} className={styles.inputForm}>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className={styles.messageInput}
            rows={3}
          />
          <button 
            type="submit" 
            disabled={!inputValue.trim()}
            className={styles.sendButton}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConversationBlock; 