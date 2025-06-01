import { useState, useEffect, useRef } from "react";
import styles from "@/styles/Conversation.module.css";
import { Message } from "@/utils/constants";
import { SOAPData } from "@/components/SOAPBlock";
import { MainPrompt } from "@/utils/llm";

interface ConversationBlockProps {
  messages: Message[];
  soapData: SOAPData;
  onAddMessage?: (fullConversation: Message[]) => void;
}

const ConversationBlock = ({ messages, soapData, onAddMessage }: ConversationBlockProps) => {
  const [inputValue, setInputValue] = useState("");
  const conversationRef = useRef<HTMLDivElement>(null);

  // Create SOAP XML section if any SOAP data exists
  const createSOAPSection = (soapData: SOAPData): string => {
    const soapElements: string[] = [];
    
    if (soapData.patientInfo.trim()) {
      soapElements.push(`<GENERAL_INFO>${soapData.patientInfo}</GENERAL_INFO>`);
    }
    if (soapData.S.trim()) {
      soapElements.push(`<S>${soapData.S}</S>`);
    }
    if (soapData.O.trim()) {
      soapElements.push(`<O>${soapData.O}</O>`);
    }
    if (soapData.A.trim()) {
      soapElements.push(`<A>${soapData.A}</A>`);
    }
    if (soapData.P.trim()) {
      soapElements.push(`<P>${soapData.P}</P>`);
    }

    if (soapElements.length > 0) {
      return `\n\n<SOAP>\n${soapElements.join('\n')}\n</SOAP>`;
    }
    
    return "";
  };

  // Create complete conversation including system prompt with SOAP data
  const systemMessageContent = MainPrompt + createSOAPSection(soapData);
  const fullConversation = [
    { role: 'system' as const, content: systemMessageContent },
    ...messages
  ];

  // Filter out system messages for display
  const displayMessages = messages.filter(message => message.role !== 'system');

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (conversationRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = conversationRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      
      if (isNearBottom || displayMessages.length > 0) {
        conversationRef.current.scrollTo({
          top: scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  }, [displayMessages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && onAddMessage) {
      // Create new user message
      const newUserMessage: Message = {
        role: 'user',
        content: inputValue.trim(),
        // timestamp: new Date()
      };
      
      // Create full conversation with new message
      const updatedFullConversation = [
        ...fullConversation,
        newUserMessage
      ];
      
      // Pass the complete conversation to parent
      onAddMessage(updatedFullConversation);
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
        {displayMessages.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No messages yet. Start a conversation!</p>
          </div>
        ) : (
          displayMessages.map((message, index) => (
            <div
              key={index}
              className={`${styles.message} ${
                message.role === 'user' ? styles.userMessage : styles.assistantMessage
              }`}
            >
              <div className={styles.messageHeader}>
                <span className={styles.role}>
                  {message.role === 'user' ? '👤 You' : '👨‍💼 AI Therapist'}
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