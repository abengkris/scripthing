import { Node, mergeAttributes } from '@tiptap/core';
export const Character = Node.create({
    name: 'character',
    group: 'block',
    content: 'inline*',
    parseHTML() {
        return [
            { tag: 'p.character' },
        ];
    },
    renderHTML({ HTMLAttributes }) {
        return ['p', mergeAttributes(HTMLAttributes, { class: 'character uppercase text-center w-[3.5in] mx-auto mt-4' }), 0];
    },
});
