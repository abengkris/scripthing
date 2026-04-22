import fetch from "node-fetch";
import { BaseAIProvider } from "./base.provider";
import {
  AICompletionOptions,
  AICompletionResult,
  SUPPORTED_MODELS,
} from "./types";

export class OllamaProvider extends BaseAIProvider {
  readonly name = "ollama";
  readonly supportedModels = SUPPORTED_MODELS.ollama.models.map((m) => m.id);
  private endpoint: string;

  constructor(endpoint: string) {
    super();
    this.endpoint = endpoint.replace(/\/$/, ""); // Remove trailing slash
  }

  async complete(options: AICompletionOptions): Promise<AICompletionResult> {
    const response = await fetch(`${this.endpoint}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: options.model,
        messages: options.messages,
        options: {
          temperature: options.temperature,
          num_predict: options.maxTokens,
        },
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.statusText}`);
    }

    const data = (await response.json()) as {
      message: { content: string };
      model: string;
    };
    return {
      content: data.message.content,
      model: data.model,
      provider: this.name,
    };
  }

  async *completeStream(
    options: AICompletionOptions,
  ): AsyncIterable<Partial<AICompletionResult>> {
    const response = await fetch(`${this.endpoint}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: options.model,
        messages: options.messages,
        options: {
          temperature: options.temperature,
          num_predict: options.maxTokens,
        },
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.statusText}`);
    }

    const body = response.body;
    if (!body) return;

    for await (const chunk of body as AsyncIterable<Buffer | string>) {
      const lines = chunk.toString().split("\n");
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const data = JSON.parse(line);
          if (data.message?.content) {
            yield {
              content: data.message.content,
              model: data.model,
              provider: this.name,
            };
          }
          if (data.done) return;
        } catch (_e) {
          // Fragmented JSON, ignore and wait for more data
        }
      }
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.endpoint}/api/tags`);
      return response.ok;
    } catch (_error) {
      return false;
    }
  }
}
