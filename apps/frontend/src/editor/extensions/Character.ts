import { Node, mergeAttributes } from '@tiptap/core';

export const Character = Node.create({
  name: 'character',
  group: 'block',
  content: 'inline*',
  parseHTML() {
    return [{ tag: 'h2' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['h2', mergeAttributes(HTMLAttributes, { class: 'text-center uppercase font-bold mt-4' }), 0];
  },
  addKeyboardShortcuts() {
    return {
      'Mod-Alt-3': () => this.editor.commands.setNode('character'),
    };
  },
});
