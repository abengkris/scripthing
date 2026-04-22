import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useAIStore } from '../../store/aiStore';
import { streamAIResponse } from '../../lib/stream';
import { Button } from '../ui/button';
export const AISidebar = () => {
    const { isOpen, setIsOpen, messages, addMessage, updateLastMessage, isLoading, setIsLoading, tokenCount, setTokenCount, provider, model, abortController, setAbortController } = useAIStore();
    const [input, setInput] = useState('');
    const handleSend = () => {
        if (!input.trim())
            return;
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
                    setTokenCount(tokenCount + 1);
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
    return (_jsxs("div", { className: `fixed right-0 top-0 h-full w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-lg p-4 flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`, children: [_jsxs("div", { className: "flex justify-between items-center mb-2", children: [_jsx("h2", { className: "text-lg font-bold text-slate-900 dark:text-slate-100", children: "AI Assistant" }), _jsx(Button, { onClick: () => setIsOpen(false), variant: "ghost", className: "text-slate-500 dark:text-slate-400", children: "Close" })] }), _jsxs("div", { className: "flex gap-2 mb-4 text-xs", children: [_jsx("span", { className: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded", children: provider.toUpperCase() }), _jsx("span", { className: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded", children: model }), _jsxs("span", { className: "ml-auto text-slate-500 dark:text-slate-400", children: ["Tokens: ", tokenCount] })] }), _jsxs("div", { className: "flex-1 overflow-y-auto mb-4 border-t border-slate-200 dark:border-slate-800 pt-2", children: [messages.map((m, i) => (_jsx("div", { className: `p-3 rounded-lg mb-2 text-sm ${m.role === 'user' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100' : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200'}`, children: m.content }, i))), isLoading && _jsx("div", { className: "text-sm text-slate-400 italic animate-pulse", children: "Generating..." })] }), _jsx("div", { className: "flex gap-2", children: isLoading ? (_jsx(Button, { onClick: handleStop, className: "w-full bg-red-600 hover:bg-red-700 text-white", children: "Stop" })) : (_jsxs(_Fragment, { children: [_jsx("input", { className: "flex-1 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500", value: input, onChange: (e) => setInput(e.target.value), placeholder: "Ask anything...", onKeyPress: (e) => e.key === 'Enter' && handleSend() }), _jsx(Button, { onClick: handleSend, className: "bg-blue-600 hover:bg-blue-700 text-white", children: "Send" })] })) })] }));
};
