// apps/backend/src/services/ai/ai.service.ts
import { BaseAIProvider } from './base.provider';
import { GeminiProvider } from './gemini.provider';

export class AIService {
  private getProvider(providerName: string, apiKey: string): BaseAIProvider {
    switch (providerName) {
      case "gemini":    return new GeminiProvider(apiKey);
      default: throw new Error(`Unknown provider: "${providerName}"`);
    }
  }

  async complete(
    providerName: string,
    apiKey: string,
    options: any
  ) {
    const provider = this.getProvider(providerName, apiKey);
    return provider.complete(options);
  }
}
