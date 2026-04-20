import { Node, mergeAttributes } from '@tiptap/core';

export const Parenthetical = Node.create({
  name: 'parenthetical',
  group: 'block',
  content: 'inline*',
  parseHTML() {
    return [{ tag: 'em' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['em', mergeAttributes(HTMLAttributes, { class: 'block mx-auto w-1/3 text-center text-sm' }), 0];
  },
  addKeyboardShortcuts() {
    return {
      'Mod-Alt-5': () => this.editor.commands.setNode('parenthetical'),
    };
  },
});
