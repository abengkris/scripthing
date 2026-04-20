import { Node, mergeAttributes } from '@tiptap/core';

export const Action = Node.create({
  name: 'action',
  group: 'block',
  content: 'inline*',
  parseHTML() {
    return [{ tag: 'p' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['p', mergeAttributes(HTMLAttributes, { class: 'mb-4' }), 0];
  },
  addKeyboardShortcuts() {
    return {
      'Mod-Alt-2': () => this.editor.commands.setNode('action'),
    };
  },
});
