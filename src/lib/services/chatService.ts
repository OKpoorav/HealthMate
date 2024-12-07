import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage, AIMessage } from '@langchain/core/messages';
import { BufferMemory } from 'langchain/memory';
import { ConversationChain } from 'langchain/chains';

// Initialize the chat model
const model = new ChatOpenAI({
  modelName: 'gpt-4',
  temperature: 0.7,
  openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

// System message content
const SYSTEM_MESSAGE_CONTENT = `You are an AI medical assistant named HealthMate. Your role is to:
1. Help patients understand their medical reports and conditions
2. Provide general health information and wellness tips
3. Assist with scheduling appointments and medication reminders
4. Answer questions about common medical procedures and terminology
5. Offer lifestyle recommendations for better health

Important guidelines:
- Always maintain a professional and empathetic tone
- Do not provide specific medical diagnoses
- Encourage users to consult healthcare professionals for specific medical advice
- Keep responses clear, concise, and easy to understand
- If unsure, acknowledge limitations and redirect to healthcare providers
- When referring to previous conversation, be specific about what was discussed`;

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export class ChatService {
  private messages: Message[] = [
    {
      id: '0',
      role: 'system',
      content: SYSTEM_MESSAGE_CONTENT,
      timestamp: new Date(),
    },
  ];

  async sendMessage(content: string): Promise<Message> {
    try {
      // Add user message to history
      const userMessage = {
        id: Date.now().toString(),
        role: 'user' as const,
        content,
        timestamp: new Date(),
      };
      this.messages.push(userMessage);

      // Create messages array for the API call
      const messages = [
        new SystemMessage(SYSTEM_MESSAGE_CONTENT),
        ...this.messages
          .filter(msg => msg.role !== 'system')
          .map(msg => 
            msg.role === 'user' 
              ? new HumanMessage(msg.content)
              : new AIMessage(msg.content)
          ),
      ];

      // Get AI response
      const response = await model.invoke(messages);

      // Add AI response to history
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: response.content.toString().trim(),
        timestamp: new Date(),
      };
      this.messages.push(aiMessage);

      return aiMessage;
    } catch (error) {
      console.error('Error in chat service:', error);
      throw new Error('Failed to get response from AI');
    }
  }

  getMessages(): Message[] {
    return this.messages;
  }

  clearHistory(): void {
    this.messages = [this.messages[0]]; // Keep system message
  }
}

export const chatService = new ChatService(); 