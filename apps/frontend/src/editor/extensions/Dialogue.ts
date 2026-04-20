import { Node, mergeAttributes } from '@tiptap/core';

export const Dialogue = Node.create({
  name: 'dialogue',
  group: 'block',
  content: 'inline*',
  parseHTML() {
    return [{ tag: 'div' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: 'mx-auto w-1/2 text-center' }), 0];
  },
  addKeyboardShortcuts() {
    return {
      'Mod-Alt-4': () => this.editor.commands.setNode('dialogue'),
    };
  },
});
