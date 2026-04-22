import { Node, mergeAttributes } from "@tiptap/core";
export const Transition = Node.create({
    name: "transition",
    group: "block",
    content: "inline*",
    parseHTML() {
        return [{ tag: "p.transition" }];
    },
    renderHTML({ HTMLAttributes }) {
        return [
            "p",
            mergeAttributes(HTMLAttributes, {
                class: "transition uppercase text-right mt-4 mb-4",
            }),
            0,
        ];
    },
});
