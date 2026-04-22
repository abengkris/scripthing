import { Node, mergeAttributes } from "@tiptap/core";

export const Parenthetical = Node.create({
  name: "parenthetical",
  group: "block",
  content: "inline*",
  parseHTML() {
    return [{ tag: "p.parenthetical" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "p",
      mergeAttributes(HTMLAttributes, {
        class: "parenthetical text-center w-[2.5in] mx-auto",
      }),
      0,
    ];
  },
  addKeyboardShortcuts() {
    return {
      Enter: () => {
        return this.editor.commands.insertContent({ type: "dialogue" });
      },
    };
  },
});
