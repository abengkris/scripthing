import { useEffect, useRef } from 'react';
import { useEditorStore } from '../store/editorStore';
import { Editor } from '@tiptap/react';

export const useAutoSave = (editor: Editor | null, intervalSeconds: number = 30) => {
  const { setContent, setIsSaving } = useEditorStore();
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!editor) return;

    intervalRef.current = setInterval(async () => {
      const json = editor.getJSON();
      const jsonString = JSON.stringify(json);
      
      setIsSaving(true);
      try {
        console.log('Auto-saving content...', jsonString.substring(0, 50));
      } catch (error) {
        console.error('Auto-save failed', error);
      } finally {
        setIsSaving(false);
      }
    }, intervalSeconds * 1000);

    return () => clearInterval(intervalRef.current);
  }, [editor, intervalSeconds, setIsSaving]);
};
