import { Editor } from '@tiptap/core';

export const handleAutoFormat = (editor: Editor) => {
  const { state, dispatch } = editor.view;
  const { selection } = state;
  const {  } = selection;
  const node = .nodeBefore;

  if (!node) return;

  // 1. New line after scene-heading -> action
  if (node.type.name === 'sceneHeading') {
    editor.commands.setNode('action');
  }

  // 2. New line after character -> dialogue
  if (node.type.name === 'character') {
    editor.commands.setNode('dialogue');
  }

  // 3. New line after dialogue -> action
  if (node.type.name === 'dialogue') {
    editor.commands.setNode('action');
  }
};
