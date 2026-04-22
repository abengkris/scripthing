import { GoogleGenerativeAI } from '@google/generative-ai';
import { BaseAIProvider } from './base.provider';
import { AICompletionOptions, AICompletionResult, SUPPORTED_MODELS } from './types';

export class GeminiProvider extends BaseAIProvider {
  readonly name = 'gemini';
  readonly supportedModels = SUPPORTED_MODELS.gemini.models.map(m => m.id);
  private genAI: GoogleGenerativeAI;

  constructor(apiKey: string) {
    super();
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  private transformMessages(messages: any[]) {
    // Gemini's generateContent can take a single prompt string or a parts array.
    // For simplicity in this implementation, we concatenate messages.
    // A more advanced version would use the Chat session API.
    return messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n');
  }

  async complete(options: AICompletionOptions): Promise<AICompletionResult> {
    const model = this.genAI.getGenerativeModel({
      model: options.model,
      generationConfig: {
        temperature: options.temperature,
        maxOutputTokens: options.maxTokens,
      },
    });

    const prompt = this.transformMessages(options.messages);
    const result = await model.generateContent(prompt);
    const response = result.response;

    return {
      content: response.text(),
      model: options.model,
      provider: this.name,
      usage: {
        promptTokens: result.response.usageMetadata?.promptTokenCount || 0,
        completionTokens: result.response.usageMetadata?.candidatesTokenCount || 0,
        totalTokens: result.response.usageMetadata?.totalTokenCount || 0,
      },
    };
  }

  async *completeStream(options: AICompletionOptions): AsyncIterable<Partial<AICompletionResult>> {
    const model = this.genAI.getGenerativeModel({
      model: options.model,
      generationConfig: {
        temperature: options.temperature,
        maxOutputTokens: options.maxTokens,
      },
    });

    const prompt = this.transformMessages(options.messages);
    const result = await model.generateContentStream(prompt);

    for await (const chunk of result.stream) {
      const content = chunk.text();
      if (content) {
        yield {
          content,
          model: options.model,
          provider: this.name,
        };
      }
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const model = this.genAI.getGenerativeModel({ model: this.supportedModels[0] });
      await model.generateContent({ contents: [{ role: 'user', parts: [{ text: 'test' }] }], generationConfig: { maxOutputTokens: 1 } });
      return true;
    } catch (error) {
      return false;
    }
  }
}
