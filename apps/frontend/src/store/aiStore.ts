import { create } from 'zustand';

interface AIState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  messages: { role: 'user' | 'assistant'; content: string }[];
  addMessage: (message: { role: 'user' | 'assistant'; content: string }) => void;
  updateLastMessage: (content: string) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  tokenCount: number;
  setTokenCount: (tokenCount: number) => void;
  provider: string;
  model: string;
  setProviderModel: (provider: string, model: string) => void;
  abortController: AbortController | null;
  setAbortController: (controller: AbortController | null) => void;
}

export const useAIStore = create<AIState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
  messages: [],
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  updateLastMessage: (content) => set((state) => {
      const messages = [...state.messages];
      const lastIndex = messages.length - 1;
      if (lastIndex >= 0 && messages[lastIndex].role === 'assistant') {
          messages[lastIndex] = { ...messages[lastIndex], content: messages[lastIndex].content + content };
      } else {
          messages.push({ role: 'assistant', content });
      }
      return { messages };
  }),
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
  tokenCount: 0,
  setTokenCount: (tokenCount) => set({ tokenCount }),
  provider: 'openai',
  model: 'gpt-4o',
  setProviderModel: (provider, model) => set({ provider, model }),
  abortController: null,
  setAbortController: (abortController) => set({ abortController }),
}));
