// apps/backend/src/services/ai/gemini.provider.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { BaseAIProvider, AICompletionOptions, AICompletionResult } from './base.provider';

export class GeminiProvider extends BaseAIProvider {
  readonly name = 'gemini';
  readonly supportedModels = ['gemini-2.0-flash'];
  private genAI: GoogleGenerativeAI;

  constructor(apiKey: string) {
    super();
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async analyze(content: string): Promise<string> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = 'You are a professional screenplay writing assistant. Analyze the following screenplay content for plot, structure, or characters:\n\n' + content;
    const result = await model.generateContent(prompt);
    return result.response.text();
  }

  async complete(options: AICompletionOptions): Promise<AICompletionResult> {
    const model = this.genAI.getGenerativeModel({ model: options.model });
    
    // Convert messages to Gemini format
    const prompt = options.messages.map(m => m.content).join('\n\n');
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return {
      content: response.text(),
      model: options.model,
      provider: this.name,
    };
  }

  async testConnection(apiKey: string): Promise<boolean> {
    try {
      const tempGenAI = new GoogleGenerativeAI(apiKey);
      const model = tempGenAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      await model.generateContent('ping');
      return true;
    } catch {
      return false;
    }
  }
}
