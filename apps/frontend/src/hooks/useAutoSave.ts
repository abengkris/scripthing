import { useMemo, useEffect } from "react";
import debounce from "lodash.debounce";
import { useEditorStore } from "../store/editorStore";
import { api } from "../lib/api";

export const useAutoSave = (scriptId: string | undefined) => {
  const { setSaveStatus, setLastSaved, addToQueue, removeFromQueue } =
    useEditorStore();

  const debouncedSave = useMemo(
    () =>
      debounce(async (content: unknown) => {
        if (!scriptId) return;

        setSaveStatus("saving");
        try {
          // Add to local queue first for persistence
          const queueId = await addToQueue(scriptId, content);

          // Attempt to save to backend
          await api.put(`/scripts/${scriptId}`, { content });

          // If successful, remove from queue and update status
          await removeFromQueue(queueId);
          setSaveStatus("saved");
          // eslint-disable-next-line react-hooks/purity
          const now = Date.now();
          setLastSaved(now);
        } catch (error) {
          console.error("Failed to auto-save:", error);
          setSaveStatus("error");
        }
      }, 2000),
    [scriptId, setSaveStatus, setLastSaved, addToQueue, removeFromQueue],
  );

  useEffect(() => {
    return () => {
      debouncedSave.cancel();
    };
  }, [debouncedSave]);

  return debouncedSave;
};
