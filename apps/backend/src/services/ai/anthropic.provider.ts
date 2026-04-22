import Anthropic from "@anthropic-ai/sdk";
import { BaseAIProvider } from "./base.provider";
import {
  AICompletionOptions,
  AICompletionResult,
  SUPPORTED_MODELS,
} from "./types";

export class AnthropicProvider extends BaseAIProvider {
  readonly name = "anthropic";
  readonly supportedModels = SUPPORTED_MODELS.anthropic.models.map((m) => m.id);
  private client: Anthropic;

  constructor(apiKey: string) {
    super();
    this.client = new Anthropic({ apiKey });
  }

  private transformMessages(messages: AICompletionOptions["messages"]) {
    const systemMessage = messages.find((m) => m.role === "system")?.content;
    const conversationMessages = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

    return { systemMessage, conversationMessages };
  }

  async complete(options: AICompletionOptions): Promise<AICompletionResult> {
    const { systemMessage, conversationMessages } = this.transformMessages(
      options.messages,
    );

    const response = await this.client.messages.create({
      model: options.model,
      system: systemMessage,
      messages: conversationMessages,
      temperature: options.temperature,
      max_tokens: options.maxTokens || 4096,
      stream: false,
    });

    const content =
      response.content[0].type === "text" ? response.content[0].text : "";
    return {
      content,
      model: response.model,
      provider: this.name,
      usage: {
        promptTokens: response.usage.input_tokens,
        completionTokens: response.usage.output_tokens,
        totalTokens: response.usage.input_tokens + response.usage.output_tokens,
      },
    };
  }

  async *completeStream(
    options: AICompletionOptions,
  ): AsyncIterable<Partial<AICompletionResult>> {
    const { systemMessage, conversationMessages } = this.transformMessages(
      options.messages,
    );

    const stream = await this.client.messages.create({
      model: options.model,
      system: systemMessage,
      messages: conversationMessages,
      temperature: options.temperature,
      max_tokens: options.maxTokens || 4096,
      stream: true,
    });

    for await (const chunk of stream) {
      if (
        chunk.type === "content_block_delta" &&
        chunk.delta.type === "text_delta"
      ) {
        yield {
          content: chunk.delta.text,
          model: options.model,
          provider: this.name,
        };
      }
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      // Small test call
      await this.client.messages.create({
        model: this.supportedModels[0],
        max_tokens: 1,
        messages: [{ role: "user", content: "test" }],
      });
      return true;
    } catch (_error) {
      return false;
    }
  }
}
