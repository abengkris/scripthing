import { AICompletionOptions, AICompletionResult } from './types';

export abstract class BaseAIProvider {
  abstract readonly name: string;
  abstract readonly supportedModels: string[];

  /**
   * Non-streaming completion.
   */
  abstract complete(options: AICompletionOptions): Promise<AICompletionResult>;

  /**
   * Streaming completion. Returns an AsyncIterable of completion result deltas.
   */
  abstract completeStream(options: AICompletionOptions): AsyncIterable<Partial<AICompletionResult>>;

  /**
   * Simple test connection to verify API key.
   */
  abstract testConnection(): Promise<boolean>;
}
