import { Node, mergeAttributes } from "@tiptap/core";

export const Action = Node.create({
  name: "action",
  group: "block",
  content: "inline*",
  parseHTML() {
    return [{ tag: "p.action" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["p", mergeAttributes(HTMLAttributes, { class: "action mt-4" }), 0];
  },
  addKeyboardShortcuts() {
    return {
      Tab: () => {
        return this.editor.commands.insertContent({ type: "character" });
      },
    };
  },
});
