export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export const sampleMessages: Message[] = [
  {
    role: 'user' as const,
    content: 'Hello! Can you help me understand how this application works?',
    timestamp: new Date(Date.now() - 300000) // 5 minutes ago
  },
  {
    role: 'assistant' as const,
    content: 'Hello! I\'d be happy to help you understand the application. This is a Next.js frontend that connects to an API backend. You can see the API status and test connectivity using the controls below.',
    timestamp: new Date(Date.now() - 240000) // 4 minutes ago
  },
  {
    role: 'user' as const,
    content: 'That\'s great! What features are available?',
    timestamp: new Date(Date.now() - 180000) // 3 minutes ago
  },
  {
    role: 'assistant' as const,
    content: 'Currently, the application includes:\n\n• API health monitoring\n• Basic connectivity testing\n• This conversation interface\n• Modular component architecture\n\nYou can expand it with more features as needed!',
    timestamp: new Date(Date.now() - 120000) // 2 minutes ago
  }
]; 