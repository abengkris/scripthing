import { Node, mergeAttributes } from "@tiptap/core";

export const SceneHeading = Node.create({
  name: "sceneHeading",
  group: "block",
  content: "inline*",
  parseHTML() {
    return [{ tag: "h1.scene-heading" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "h1",
      mergeAttributes(HTMLAttributes, {
        class: "scene-heading uppercase font-bold mt-8 mb-4",
      }),
      0,
    ];
  },
});
