import { getGeminiModel } from '../config/gemini';

// System message content
const SYSTEM_MESSAGE_CONTENT = `You are HealthMate, a friendly and professional medical AI assistant.

When responding to medical queries:

1. Structure:
   • Start with a brief acknowledgment of the symptom/concern
   • Provide 2-3 immediate helpful suggestions
   • Include common medications if relevant
   • Add simple home remedies if applicable
   • ALWAYS end with an appropriate medical disclaimer

2. Format responses as:
   # [Main Concern]
   _Brief assessment of the situation_

   ## Recommended Actions
   • [Action point 1]
   • [Action point 2]

   ## Common Medications
   • [Medication 1] - [brief purpose]
   • [Medication 2] - [brief purpose]

   > Note: Please consult a healthcare professional if symptoms persist or worsen.

3. Keep tone:
   • Empathetic but professional
   • Clear and direct
   • Informative without being overwhelming

4. Medical Disclaimer:
   Always include a relevant disclaimer based on the severity of the condition.
   Example: "These are general suggestions. If symptoms are severe or persist, please seek medical attention."

Remember: Never diagnose, only suggest common remedies and always encourage professional medical consultation when appropriate.`;

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  formattedTime?: string;
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

  private model = getGeminiModel();

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

      // Create chat history for Gemini
      const chat = this.model.startChat({
        history: this.messages
          .filter(msg => msg.role !== 'system')
          .map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
          })),
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        },
      });

      // Get AI response with context
      const result = await chat.sendMessage([
        { text: `${SYSTEM_MESSAGE_CONTENT}\n\nRespond to this user query: ${content}\n\nRemember to be specific to the query and include appropriate medical disclaimers.` }
      ]);
      const response = await result.response;
      const responseText = response.text();

      // Add AI response to history
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: responseText.trim(),
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
    return this.messages.map(msg => ({
      ...msg,
      timestamp: new Date(msg.timestamp),
      formattedTime: new Date(msg.timestamp).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).replace(/\s/g, '')  // Remove spaces between time and AM/PM
    }));
  }

  clearHistory(): void {
    this.messages = [this.messages[0]]; // Keep system message
  }
}

export const chatService = new ChatService(); 