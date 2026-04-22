import OpenAI from "openai";
import { BaseAIProvider } from "./base.provider";
import {
  AICompletionOptions,
  AICompletionResult,
  SUPPORTED_MODELS,
} from "./types";

export class OpenAIProvider extends BaseAIProvider {
  readonly name = "openai";
  readonly supportedModels = SUPPORTED_MODELS.openai.models.map((m) => m.id);
  private client: OpenAI;

  constructor(apiKey: string) {
    super();
    this.client = new OpenAI({ apiKey });
  }

  async complete(options: AICompletionOptions): Promise<AICompletionResult> {
    const response = await this.client.chat.completions.create({
      model: options.model,
      messages: options.messages as OpenAI.Chat.ChatCompletionMessageParam[],
      temperature: options.temperature,
      max_tokens: options.maxTokens,
      stream: false,
    });

    const choice = response.choices[0];
    return {
      content: choice.message.content || "",
      model: response.model,
      provider: this.name,
      usage: response.usage
        ? {
            promptTokens: response.usage.prompt_tokens,
            completionTokens: response.usage.completion_tokens,
            totalTokens: response.usage.total_tokens,
          }
        : undefined,
    };
  }

  async *completeStream(
    options: AICompletionOptions,
  ): AsyncIterable<Partial<AICompletionResult>> {
    const stream = await this.client.chat.completions.create({
      model: options.model,
      messages: options.messages as OpenAI.Chat.ChatCompletionMessageParam[],
      temperature: options.temperature,
      max_tokens: options.maxTokens,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        yield {
          content,
          model: chunk.model,
          provider: this.name,
        };
      }
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      // Use a cheap operation to test the key
      await this.client.models.list();
      return true;
    } catch (_error) {
      return false;
    }
  }
}
