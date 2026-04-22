import { Extension } from "@tiptap/core";
export const ScreenplayShortcuts = Extension.create({
    name: "screenplayShortcuts",
    addKeyboardShortcuts() {
        return {
            "Mod-1": () => this.editor.commands.setNode("sceneHeading"),
            "Mod-2": () => this.editor.commands.setNode("action"),
            "Mod-3": () => this.editor.commands.setNode("character"),
            "Mod-4": () => this.editor.commands.setNode("parenthetical"),
            "Mod-5": () => this.editor.commands.setNode("dialogue"),
            "Mod-6": () => this.editor.commands.setNode("transition"),
        };
    },
});
