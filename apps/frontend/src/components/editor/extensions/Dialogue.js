import { Node, mergeAttributes } from '@tiptap/core';
export const Dialogue = Node.create({
    name: 'dialogue',
    group: 'block',
    content: 'inline*',
    parseHTML() {
        return [
            { tag: 'p.dialogue' },
        ];
    },
    renderHTML({ HTMLAttributes }) {
        return ['p', mergeAttributes(HTMLAttributes, { class: 'dialogue text-center w-[3.5in] mx-auto' }), 0];
    },
});
