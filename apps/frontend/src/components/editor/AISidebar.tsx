import React, { useState } from 'react';
import { useAIStore } from '../../store/aiStore';
import { streamAIResponse } from '../../lib/stream';
import { Button } from '../ui/button';

export const AISidebar: React.FC = () => {
  const { 
    isOpen, setIsOpen, messages, addMessage, updateLastMessage, 
    isLoading, setIsLoading, tokenCount, setTokenCount, 
    provider, model, abortController, setAbortController 
  } = useAIStore();
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    addMessage({ role: 'user', content: input });
    setInput('');
    setIsLoading(true);
    setTokenCount(0);

    const ctrl = streamAIResponse({
      url: '/api/v1/ai/chat',
      body: { provider, model, messages: [...messages, { role: 'user', content: input }], stream: true },
      onMessage: (data) => {
        if (data.content) {
            updateLastMessage(data.content);
            setTokenCount(tokenCount + 1); // Simple approximation
        }
      },
      onClose: () => { setIsLoading(false); setAbortController(null); },
      onError: (err) => { console.error(err); setIsLoading(false); setAbortController(null); }
    });
    setAbortController(ctrl);
  };

  const handleStop = () => {
      abortController?.abort();
      setIsLoading(false);
      setAbortController(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white border-l shadow-lg p-4 flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold">AI Assistant</h2>
        <Button onClick={() => setIsOpen(false)}>Close</Button>
      </div>
      <div className="flex gap-2 mb-4 text-xs text-gray-500">
        <span className="bg-gray-100 px-2 py-1 rounded">{provider.toUpperCase()}</span>
        <span className="bg-gray-100 px-2 py-1 rounded">{model}</span>
        <span className="ml-auto">Tokens: {tokenCount}</span>
      </div>
      <div className="flex-1 overflow-y-auto mb-4 border-t pt-2">
        {messages.map((m, i) => (
          <div key={i} className={`p-2 rounded mb-2 text-sm ${m.role === 'user' ? 'bg-blue-50 text-blue-900' : 'bg-gray-50 text-gray-800'}`}>
            {m.content}
          </div>
        ))}
        {isLoading && <div className="text-sm text-gray-400 italic animate-pulse">Generating...</div>}
      </div>
      <div className="flex gap-2">
        {isLoading ? (
            <Button onClick={handleStop} className="w-full bg-red-500 hover:bg-red-600">Stop</Button>
        ) : (
            <>
                <input 
                    className="flex-1 border p-2 rounded text-sm" 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask anything..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <Button onClick={handleSend}>Send</Button>
            </>
        )}
      </div>
    </div>
  );
};
