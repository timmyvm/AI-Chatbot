"use client";

import React, { useState } from 'react';

const ChatApp = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ content: string; sender: 'user' | 'ai' }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (input.trim() === '') return;

    // Add user message
    setMessages((prev) => [...prev, { content: input, sender: 'user' }]);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      
      const data = await response.json();
      
      // Add AI response
      setMessages((prev) => [...prev, { content: data.response, sender: 'ai' }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [...prev, { content: 'Sorry, something went wrong!', sender: 'ai' }]);
    }

    setIsLoading(false);
    setInput('');
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="flex flex-col h-screen bg-[#121212]">
      {/* header */}
      <div className="bg-[#121212] shadow flex items-center p-4">
      <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
        <h1 className="text-lg text-white font-medium">AI Assistant</h1>
      </div>

      {/* messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs md:max-w-md rounded-lg p-3 ${msg.sender === 'user' ? 'bg-blue-500 text-white' : ' bg-[#2A2A2A] text-white '}`}>
              
                <p>{msg.content}</p>
              </div>
            </div>
          ))}

          {/* loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#2A2A2A] rounded-lg p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* input */}
      <div className="p-4 bg-[#121212] border-t">
        <div className="max-w-3xl mx-auto flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 p-2 bg-[#2A2A2A] text-white rounded-l-lg"
          />
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded-r-lg disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
