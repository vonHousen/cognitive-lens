export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

// Use fixed timestamps instead of dynamic Date.now()
const baseTime = new Date('2024-03-15T10:00:00Z'); // Fixed base time

export const messagesStarter: Message[] = [
  {
    role: 'assistant' as const,
    content: 'Hi, tell me about yourself.',
  },
];

export interface SOAPData {
  patientInfo: string; // General patient information
  S: string; // Subjective
  O: string; // Objective
  A: string; // Assessment
  P: string; // Plan
}

// Keep these for the simplified structure:
export const soapContentStarter: SOAPData = {
  patientInfo: "",
  S: "",
  O: "",
  A: "",
  P: ""
};

export const textContents: string[] = [
  "Text content from LLM",
  "Another LLM text content",
];
