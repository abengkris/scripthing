export type AIRole = 'user' | 'assistant' | 'system';

export interface AIMessage {
  role: AIRole;
  content: string;
}

export interface AICompletionOptions {
  messages: AIMessage[];
  model: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface AICompletionResult {
  content: string;
  model: string;
  provider: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AIModel {
  id: string;
  name: string;
  maxTokens: number;
  contextWindow: number;
}

export interface ProviderConfig {
  id: string;
  name: string;
  models: AIModel[];
}

export const SUPPORTED_MODELS: Record<string, ProviderConfig> = {
  openai: {
    id: 'openai',
    name: 'OpenAI',
    models: [
      { id: 'gpt-4o', name: 'GPT-4o', maxTokens: 4096, contextWindow: 128000 },
      { id: 'gpt-4o-mini', name: 'GPT-4o mini', maxTokens: 4096, contextWindow: 128000 },
    ],
  },
  anthropic: {
    id: 'anthropic',
    name: 'Anthropic',
    models: [
      { id: 'claude-3-5-sonnet-20240620', name: 'Claude 3.5 Sonnet', maxTokens: 4096, contextWindow: 200000 },
      { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', maxTokens: 4096, contextWindow: 200000 },
    ],
  },
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    models: [
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', maxTokens: 8192, contextWindow: 1000000 },
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', maxTokens: 8192, contextWindow: 1000000 },
    ],
  },
  ollama: {
    id: 'ollama',
    name: 'Ollama (Local)',
    models: [
      { id: 'llama3', name: 'Llama 3', maxTokens: 4096, contextWindow: 8192 },
      { id: 'mistral', name: 'Mistral', maxTokens: 4096, contextWindow: 8192 },
    ],
  },
};
