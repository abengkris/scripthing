// apps/backend/src/services/ai/base.provider.ts

export interface AIMessage {
  role: "user" | "assistant" | "system";
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

export abstract class BaseAIProvider {
  abstract readonly name: string;
  abstract readonly supportedModels: string[];

  abstract complete(options: AICompletionOptions): Promise<AICompletionResult>;
  abstract testConnection(apiKey: string): Promise<boolean>;
}
