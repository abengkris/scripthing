import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useAuthStore } from "../store/authStore";

export interface StreamOptions {
  url: string;
  body: Record<string, unknown>;
  onMessage: (data: Record<string, unknown>) => void;
  onError?: (err: unknown) => void;
  onClose?: () => void;
}

export const streamAIResponse = (options: StreamOptions) => {
  const { accessToken } = useAuthStore.getState();
  const ctrl = new AbortController();

  fetchEventSource(options.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(options.body),
    signal: ctrl.signal,
    onmessage(msg) {
      if (msg.data === "[DONE]") {
        if (options.onClose) options.onClose();
        return;
      }
      try {
        const parsed = JSON.parse(msg.data);
        options.onMessage(parsed);
      } catch (err) {
        if (options.onError) options.onError(err);
      }
    },
    onerror(err) {
      if (options.onError) options.onError(err);
      throw err;
    },
  });

  return ctrl;
};
