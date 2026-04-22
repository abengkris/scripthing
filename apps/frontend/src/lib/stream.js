import { fetchEventSource } from '@microsoft/fetch-event-source';
import { useAuthStore } from '../store/authStore';
export const streamAIResponse = (options) => {
    const { accessToken } = useAuthStore.getState();
    const ctrl = new AbortController();
    fetchEventSource(options.url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(options.body),
        signal: ctrl.signal,
        onmessage(msg) {
            if (msg.data === '[DONE]') {
                if (options.onClose)
                    options.onClose();
                return;
            }
            try {
                const parsed = JSON.parse(msg.data);
                options.onMessage(parsed);
            }
            catch (err) {
                if (options.onError)
                    options.onError(err);
            }
        },
        onerror(err) {
            if (options.onError)
                options.onError(err);
            throw err;
        },
    });
    return ctrl;
};
