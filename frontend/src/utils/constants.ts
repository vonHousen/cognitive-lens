export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

// Use fixed timestamps instead of dynamic Date.now()
const baseTime = new Date('2024-03-15T10:00:00Z'); // Fixed base time

export const sampleMessages: Message[] = [
  {
    role: 'user' as const,
    content: 'Hello! Can you help me understand how this application works?',
    timestamp: new Date(baseTime.getTime() - 300000) // 5 minutes before base time
  },
  {
    role: 'assistant' as const,
    content: 'Hello! I\'d be happy to help you understand the application. This is a Next.js frontend that connects to an API backend. You can see the API status and test connectivity using the controls below.',
    timestamp: new Date(baseTime.getTime() - 240000) // 4 minutes before base time
  },
  {
    role: 'user' as const,
    content: 'That\'s great! What features are available?',
    timestamp: new Date(baseTime.getTime() - 180000) // 3 minutes before base time
  },
  {
    role: 'assistant' as const,
    content: 'Currently, the application includes:\n\n• API health monitoring\n• Basic connectivity testing\n• This conversation interface\n• Modular component architecture\n\nYou can expand it with more features as needed!',
    timestamp: new Date(baseTime.getTime() - 120000) // 2 minutes before base time
  }
];

export interface SOAPData {
  patientInfo: string; // General patient information
  S: string; // Subjective
  O: string; // Objective
  A: string; // Assessment
  P: string; // Plan
}

// Keep these for the simplified structure:
export const soapContent: SOAPData = {
  patientInfo: "Patient: John Doe, Age: 32, Session: Initial Consultation, Date: March 15, 2024",
  S: "User reports difficulty understanding the application workflow and requests guidance on available features",
  O: "Application is running normally, all API endpoints are responsive, user has successfully loaded the interface",
  A: "User needs orientation and feature explanation to maximize application utilization and understanding",
  P: "Provide comprehensive walkthrough of features, demonstrate key functionalities, and establish clear usage patterns"
};

export const textContents: string[] = [
  "Explore powerful features including real-time conversation, API monitoring, and intelligent responses",
  "Get started with your journey today - Experience seamless integration between frontend and backend"
];
