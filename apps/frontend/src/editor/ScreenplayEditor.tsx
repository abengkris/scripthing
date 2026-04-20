import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { SceneHeading } from './extensions/SceneHeading';
import { Action } from './extensions/Action';
import { Character } from './extensions/Character';
import { Dialogue } from './extensions/Dialogue';
import { Parenthetical } from './extensions/Parenthetical';
import { Transition } from './extensions/Transition';

import { AutoFormat } from './extensions/AutoFormat';
import { useAutoSave } from '../hooks/useAutoSave';

export const ScreenplayEditor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      SceneHeading,
      Action,
      Character,
      Dialogue,
      Parenthetical,
      Transition,
      AutoFormat,
    ],
    content: '<p>Start writing your screenplay...</p>',
  });

  useAutoSave(editor);

  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <EditorContent editor={editor} />
    </div>
  );
};
