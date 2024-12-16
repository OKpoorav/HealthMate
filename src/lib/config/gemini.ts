import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
export const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Initialize the chat model
export const getGeminiModel = () => {
  return genAI.getGenerativeModel({ model: "gemini-pro" });
}; 