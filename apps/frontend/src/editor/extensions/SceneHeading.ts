import { Node, mergeAttributes } from '@tiptap/core';

export const SceneHeading = Node.create({
  name: 'sceneHeading',
  group: 'block',
  content: 'inline*',
  parseHTML() {
    return [{ tag: 'h1' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['h1', mergeAttributes(HTMLAttributes, { class: 'uppercase font-bold' }), 0];
  },
  addKeyboardShortcuts() {
    return {
      'Mod-Alt-1': () => this.editor.commands.setNode('sceneHeading'),
    };
  },
});
