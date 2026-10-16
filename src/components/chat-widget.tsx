"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { track } from '@vercel/analytics';
import { usePathname } from 'next/navigation';
import { useChatContext } from '@/contexts/chat-context';

const classicStyles = {
  notification: "bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 rounded-lg",
  notificationText: "Paste a job description — I'll check the fit.",
  arrow: "border-t-pink-500",
  toggle: "bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 rounded-full",
  pulse: "236, 72, 153",
  panel: "bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-lg border-gray-700",
  header: "bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500",
  title: "Akshit's AI Assistant",
  titleClass: "text-white font-semibold",
  userBubble: "bg-gradient-to-r from-pink-500 to-violet-500 text-white rounded-lg",
  aiBubble: "bg-gray-700 text-gray-100 rounded-lg",
  inputBar: "border-gray-700",
  input: "bg-gray-800 rounded-lg focus:ring-pink-500",
  send: "bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 rounded-lg",
};

const neonStyles: typeof classicStyles = {
  notification: "bg-[#07060f]/95 border border-[#ff2a8a] shadow-[0_0_24px_-6px_#ff2a8a] font-mono",
  notificationText: "Paste a job description — I'll check the fit.",
  arrow: "border-t-[#ff2a8a]",
  toggle: "bg-[#07060f] border border-[#ff2a8a] text-[#ff2a8a] rounded-full shadow-[0_0_24px_-4px_#ff2a8a]",
  pulse: "255, 42, 138",
  panel: "bg-[#06050d]/95 backdrop-blur-md border-[#19e6ff]/30 shadow-[0_0_60px_-20px_#19e6ff] rounded-none",
  header: "bg-transparent border-b border-white/10",
  title: "Fit check",
  titleClass: "text-white font-mono text-xs uppercase tracking-[0.25em]",
  userBubble: "bg-[#ff2a8a]/15 border border-[#ff2a8a]/50 text-white",
  aiBubble: "bg-white/5 border border-white/10 text-white/85",
  inputBar: "border-white/10",
  input: "bg-black/60 border border-white/10 rounded-none focus:ring-[#19e6ff]",
  send: "bg-[#ff2a8a] hover:bg-[#19e6ff] text-black rounded-none",
};

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatWidget() {
  const { isOpen, toggleChat } = useChatContext();
  const s = usePathname()?.startsWith('/classic') ? classicStyles : neonStyles;
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi — paste a job description and I'll tell you how well it fits Akshit's profile. You can also ask about his work, projects, or how to reach him.",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showNotification, setShowNotification] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Auto-hide notification after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleChatToggle = () => {
    const newIsOpen = !isOpen;
    toggleChat();
    setShowNotification(false); // Hide notification when chat is opened
    
    // Track chat open/close events
    if (newIsOpen) {
      track('chat_opened', {
        timestamp: new Date().toISOString(),
        total_messages: messages.length
      });
    } else {
      track('chat_closed', {
        timestamp: new Date().toISOString(),
        total_messages: messages.length
      });
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Track message sent with enhanced metadata
    track('chat_message_sent', {
      message: input.trim(),
      message_length: input.trim().length,
      timestamp: new Date().toISOString(),
      message_count: messages.length + 1,
      session_id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
      question_id: Date.now().toString()
    });

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input.trim(),
          history: messages
            .filter((m) => m.id !== '1')
            .slice(-10)
            .map((m) => ({ role: m.isUser ? 'user' : 'assistant', content: m.content })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

      // Track successful response
      track('chat_response_received', {
        response_length: data.message.length,
        timestamp: new Date().toISOString(),
        message_count: messages.length + 2
      });
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);

      // Track error
      track('chat_error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        message_count: messages.length + 2
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Notification */}
      <AnimatePresence>
        {showNotification && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            className={`fixed bottom-24 right-6 z-50 p-3 shadow-lg max-w-xs ${s.notification}`}
          >
            <div className="flex items-center space-x-2 text-white">
              <Bot className="w-4 h-4" />
              <p className="text-sm font-medium">{s.notificationText}</p>
            </div>
            <div className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${s.arrow}`}></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Toggle Button */}
      <motion.button
        onClick={handleChatToggle}
        className={`fixed bottom-6 right-6 z-50 p-4 shadow-lg hover:shadow-xl transition-all duration-300 group ${s.toggle}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: [
            `0 0 0 0 rgba(${s.pulse}, 0.7)`,
            `0 0 0 10px rgba(${s.pulse}, 0)`,
            `0 0 0 0 rgba(${s.pulse}, 0.7)`
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed top-20 bottom-24 left-4 right-4 md:left-auto md:right-6 z-40 md:w-[50%] lg:w-[34rem] shadow-2xl border overflow-hidden flex flex-col ${s.panel}`}
          >
            {/* Header */}
            <div className={`px-4 py-2 flex-shrink-0 ${s.header}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bot className="w-5 h-5 text-white" />
                  <h3 className={s.titleClass}>{s.title}</h3>
                </div>
                <button
                  onClick={handleChatToggle}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto" data-lenis-prevent>
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md px-4 py-3 ${message.isUser ? s.userBubble : s.aiBubble}`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className={`px-4 py-3 ${s.aiBubble}`}>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className={`p-4 border-t flex-shrink-0 ${s.inputBar}`}>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Paste a job description, or ask about Akshit..."
                  className={`flex-1 min-w-0 text-base md:text-sm text-white placeholder-gray-400 px-4 py-2 focus:outline-none focus:ring-2 ${s.input}`}
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isLoading}
                  className={`text-white p-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${s.send}`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 