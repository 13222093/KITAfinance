'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, MessageCircle, Trash2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Generate random user ID for session
const generateUserId = () => `user_${Math.random().toString(36).substring(2, 11)}`;

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Halo! 👋 Aku KITA AI, asisten pintar yang siap bantu kamu belajar tentang DeFi options dan Thetanuts V4.\n\nMau tanya apa? Misalnya:\n• "Apa itu Thetanuts?"\n• "Gimana cara kerja Cash-Secured Put?"\n• "Apa bedanya Call dan Put?"',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userId] = useState(generateUserId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const clearHistory = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/chat/history/${userId}`, {
        method: 'DELETE',
      });
      setMessages([{
        role: 'assistant',
        content: 'Conversation cleared! 🧹 Ada yang bisa kubantu tentang Thetanuts atau DeFi options?',
      }]);
    } catch (error) {
      console.error('Clear history error:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, message: userMessage }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.data?.message || data.response || 'Maaf, ada kendala.' },
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Maaf, tidak bisa terhubung ke server. Pastikan backend sudah running di port 8000! 🔧',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    const handleMobileToggle = () => setIsOpen(prev => !prev);
    window.addEventListener('toggle-chat-mobile', handleMobileToggle);
    return () => window.removeEventListener('toggle-chat-mobile', handleMobileToggle);
  }, []);

  return (
    <>
      {/* Modal Popup - Shared for Desktop & Mobile */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Blurred Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          />

          {/* Chat Window - Centered Modal */}
          <div className="relative w-full max-w-2xl h-[80vh] max-h-[700px] bg-white rounded-3xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#C15BFF] via-[#0A98FF] to-[#00FFF0] text-white p-5 rounded-t-3xl flex items-center justify-between shrink-0 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black drop-shadow-lg">KITA AI</h3>
                  <p className="text-xs opacity-90 font-semibold">Asisten Virtual 🤖</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearHistory}
                  className="hover:bg-white/20 rounded-full p-2 transition-colors"
                  title="Clear History"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-md ${message.role === 'user'
                      ? 'bg-gradient-to-r from-[#0A98FF] to-[#C15BFF] text-white'
                      : 'bg-white text-gray-800 border border-gray-200'
                      }`}
                  >
                    <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 rounded-2xl px-4 py-3 shadow-md border border-gray-200">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-[#0A98FF] rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-[#C15BFF] rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-[#00FFF0] rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white rounded-b-3xl shadow-lg">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ketik pesan..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0A98FF] focus:border-transparent disabled:bg-gray-100 text-gray-900 bg-white text-sm md:text-base placeholder:text-gray-500"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="bg-gradient-to-r from-[#0A98FF] to-[#C15BFF] text-white p-3 rounded-full hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <Send className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop: Bottom-right floating button - Hidden on mobile (uses MobileNav instead) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden md:flex fixed bottom-6 right-8 w-16 h-16 bg-gradient-to-r from-[#0A98FF] to-[#C15BFF] text-white rounded-full shadow-2xl hover:scale-110 transition-transform items-center justify-center z-50"
        aria-label="Toggle Chat"
      >
        {isOpen ? (
          <X className="w-8 h-8" />
        ) : (
          <MessageCircle className="w-8 h-8" />
        )}
      </button>
    </>
  );
}
