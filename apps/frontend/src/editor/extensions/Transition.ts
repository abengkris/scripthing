import { Node, mergeAttributes } from '@tiptap/core';

export const Transition = Node.create({
  name: 'transition',
  group: 'block',
  content: 'inline*',
  parseHTML() {
    return [{ tag: 'h3' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['h3', mergeAttributes(HTMLAttributes, { class: 'text-right uppercase font-bold mt-4' }), 0];
  },
  addKeyboardShortcuts() {
    return {
      'Mod-Alt-6': () => this.editor.commands.setNode('transition'),
    };
  },
});
