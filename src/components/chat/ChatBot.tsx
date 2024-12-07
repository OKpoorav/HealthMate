import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Loader2, Bot, ArrowDown } from 'lucide-react';
import { chatService, Message } from '@/lib/services/chatService';

const TypingIndicator = () => (
  <div className="flex space-x-2 p-3 bg-gray-100 rounded-lg max-w-[80%]">
    <div className="flex space-x-1 items-center">
      <Bot className="h-5 w-5 text-blue-600" />
      <div className="flex space-x-1">
        {[1, 2, 3].map((dot) => (
          <motion.div
            key={dot}
            className="w-2 h-2 bg-blue-600 rounded-full"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, delay: dot * 0.2 }}
          />
        ))}
      </div>
    </div>
  </div>
);

const ScrollButton = ({ onClick }: { onClick: () => void }) => (
  <motion.button
    onClick={onClick}
    className="absolute bottom-20 right-4 p-2 bg-blue-600 text-white rounded-full shadow-lg"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
  >
    <ArrowDown className="h-4 w-4" />
  </motion.button>
);

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(chatService.getMessages());
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom('auto');
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const messageText = newMessage.trim();
    if (!messageText || isLoading) return;

    setIsLoading(true);
    setNewMessage(''); // Clear input immediately after sending

    try {
      await chatService.sendMessage(messageText);
      setMessages(chatService.getMessages());
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-16 right-0 w-96 h-[600px] bg-white rounded-lg shadow-xl flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b flex justify-between items-center bg-blue-600 text-white rounded-t-lg">
              <div className="flex items-center space-x-2">
                <Bot className="h-5 w-5" />
                <div>
                  <h3 className="font-semibold">HealthMate Assistant</h3>
                  <p className="text-xs text-blue-100">AI-powered medical assistant</p>
                </div>
              </div>
              <button
                onClick={toggleChat}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
            >
              {/* Welcome Message */}
              {messages.length === 1 && (
                <div className="text-center text-gray-500 text-sm py-4">
                  👋 Hi! I'm your HealthMate Assistant. How can I help you today?
                </div>
              )}

              {messages.map((message) => (
                message.role !== 'system' && (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg shadow-sm ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                )
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <TypingIndicator />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {showScrollButton && <ScrollButton onClick={() => scrollToBottom()} />}

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t bg-gray-50">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  disabled={isLoading}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                />
                <button
                  type="submit"
                  disabled={isLoading || !newMessage.trim()}
                  className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </div>
              <div className="mt-2 text-xs text-gray-500 text-center">
                Press Enter to send, Shift + Enter for new line
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        onClick={toggleChat}
        className={`p-4 rounded-full shadow-lg transition-colors ${
          isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <MessageSquare className="h-6 w-6 text-white" />
        )}
      </motion.button>
    </div>
  );
};

export default ChatBot; 