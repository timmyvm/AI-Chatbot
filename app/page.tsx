'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage, setLoading } from '../store/chatSlice';
import { RootState } from '../store';
import axios from 'axios';

export default function Home() {
  const [input, setInput] = useState('');
  const dispatch = useDispatch();
  const { messages, loading } = useSelector((state: RootState) => state.chat);

  const sendMessage = async () => {
    if (!input.trim()) return;
    dispatch(addMessage({ text: input, sender: 'user' }));
    dispatch(setLoading(true));
    setInput('');

    try {
      const response = await axios.post('http://localhost:8000/chat', { message: input }, {
        headers: { 'Content-Type': 'application/json' },
      });
      dispatch(addMessage({ text: response.data.response, sender: 'bot' }));
    } catch (error: any) {
      console.error('API Error:', error);
      dispatch(addMessage({ text: `Error: ${error.message || 'Could not get response'}`, sender: 'bot' }));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">DeepSeek Chatbot</h1>
      <div className="border rounded p-4 h-96 overflow-y-auto mb-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              {msg.text.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
            </span>
          </div>
        ))}
        {loading && <p className="text-gray-500">Typing...</p>}
      </div>
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 border rounded-l p-2"
          placeholder="Type a message..."
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white p-2 rounded-r"
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
}